function downloadMarkdown() {
    const title = document.getElementById('title-input').value.trim() || 'untitled';
    const content = document.getElementById('md-editor').value;
    const now = new Date().toISOString().slice(0, 10);
    const md = `---
title: ${title}
date: ${now}
---

${content}`;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title + '.md';
    a.click();
    URL.revokeObjectURL(url);
}

function clearEditor() {
    document.getElementById('title-input').value = '';
    document.getElementById('md-editor').value = '';
}
