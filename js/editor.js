const editor = {
    insert: (prefix, suffix) => {
        const ta = document.getElementById('editor-content');
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const text = ta.value;
        ta.value = text.substring(0, start) + prefix + text.substring(start, end) + suffix + text.substring(end);
        ta.focus();
        ta.selectionStart = start + prefix.length;
        ta.selectionEnd = end + prefix.length;
    },

    insertTable: () => {
        const ta = document.getElementById('editor-content');
        if (!ta) return;
        const table = [
            '| 表头1 | 表头2 |',
            '| --- | --- |',
            '| 内容1 | 内容2 |',
            ''
        ].join('\n');
        ta.value += '\n' + table;
    }
};
