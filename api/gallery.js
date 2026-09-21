const fs = require('fs');
const path = require('path');

function parseFrontmatter(content) {
  if (!content) return {};
  const cleanContent = content.replace(/^\uFEFF/, '').trimStart();
  const match = cleanContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { description: cleanContent.trim() };
  
  const yaml = match[1];
  const body = cleanContent.slice(match[0].length).trim();
  const data = {};
  
  const lines = yaml.split(/\r?\n/);
  let currentKey = null;
  let isMultiLine = false;
  let multiLineValues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matchKey = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (matchKey) {
      if (currentKey && isMultiLine) {
        data[currentKey] = multiLineValues.join('\n').trim();
        isMultiLine = false;
        multiLineValues = [];
      }
      currentKey = matchKey[1];
      let val = matchKey[2].trim();
      if (val === '>-' || val === '>' || val === '|' || val === '|-') {
        isMultiLine = true;
        multiLineValues = [];
      } else {
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        data[currentKey] = val;
      }
    } else if (isMultiLine && currentKey) {
      multiLineValues.push(line.replace(/^\s{2}/, ''));
    }
  }
  if (currentKey && isMultiLine) {
    data[currentKey] = multiLineValues.join('\n').trim();
  }

  if (body && !data.description) {
    data.description = body;
  }
  return data;
}

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  const type = req.query.type === '3d' ? '3d' : (req.query.type === 'video' ? 'video' : (req.query.type === 'photo' ? 'photo' : '2d'));
  const folder = path.join(process.cwd(), 'content', type);
  const fallbackFile = path.join(process.cwd(), 'data', `gallery-${type}.json`);

  try {
    if (!fs.existsSync(folder)) {
      if (fs.existsSync(fallbackFile)) {
        return res.status(200).send(fs.readFileSync(fallbackFile, 'utf8'));
      }
      return res.status(200).json([]);
    }

    const files = fs.readdirSync(folder).filter(f => f.endsWith('.md') || f.endsWith('.json'));
    const items = [];

    files.forEach(filename => {
      const fullPath = path.join(folder, filename);
      const fileContent = fs.readFileSync(fullPath, 'utf8');
      if (filename.endsWith('.json')) {
        try {
          items.push(JSON.parse(fileContent));
        } catch (e) {}
      } else {
        const parsed = parseFrontmatter(fileContent);
        parsed.slug = filename.replace(/\.md$/, '');

        // Smart image fallback if missing
        if (!parsed.image && /^(pic|art|3d|video)/.test(parsed.slug)) {
          const folderMap = { photo: 'Photography', '2d': 'Gambar', '3d': '3D', video: 'Video' };
          const ext = type === '3d' ? 'png' : 'jpg';
          parsed.image = `images/${folderMap[type] || 'Photography'}/${parsed.slug}.${ext}`;
        } else if (parsed.image) {
          const cleanPath = parsed.image.replace(/^\//, '');
          const rootPath = path.join(process.cwd(), cleanPath);
          const nestedPath = path.join(process.cwd(), 'content', type, cleanPath);
          if (!fs.existsSync(rootPath) && fs.existsSync(nestedPath)) {
            parsed.image = `content/${type}/${cleanPath}`;
          }
        }

        items.push(parsed);
      }
    });

    if (type === 'video') {
      const order = ['pingo-pingu', 'sdit-salsabila-2-klaseman', 'pamali'];
      items.sort((a, b) => {
        const idxA = order.indexOf(a.slug);
        const idxB = order.indexOf(b.slug);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return (b.year || '').localeCompare(a.year || '');
      });
    } else {
      // Custom priority: custom uploads (like gfx-poster-denia-wuwa) at the top, then sequential
      items.sort((a, b) => {
        const aIsNumbered = a.slug && /^(2d|3d|pic)-\d{2}-\d{2}-\d{4}/.test(a.slug);
        const bIsNumbered = b.slug && /^(2d|3d|pic)-\d{2}-\d{2}-\d{4}/.test(b.slug);
        if (!aIsNumbered && bIsNumbered) return -1;
        if (aIsNumbered && !bIsNumbered) return 1;
        return (a.slug || '').localeCompare(b.slug || '');
      });
    }

    return res.status(200).json(items);
  } catch (err) {
    if (fs.existsSync(fallbackFile)) {
      return res.status(200).send(fs.readFileSync(fallbackFile, 'utf8'));
    }
    return res.status(200).json([]);
  }
};
