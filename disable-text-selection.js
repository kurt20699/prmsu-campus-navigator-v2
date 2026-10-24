// ══════════════════════════════════════════
// 🚫 NO TEXT SELECTION / LONG-PRESS MENU
// ══════════════════════════════════════════
// Makes the app feel like a native app: long-pressing a label, button or
// any other text no longer highlights it or opens the browser's
// "Copy · Select all · Web search · Share" menu.
//
// Still allowed (so typing and copying keep working where they matter):
//   • text boxes — inputs, textareas, editable areas
//   • the AI chat window (so answers can be copied)
//   • anything you mark with class="selectable"

(function () {
    'use strict';

    const ALLOW = 'input, textarea, [contenteditable="true"], #ai-chat-widget-root, .selectable';

    const style = document.createElement('style');
    style.textContent = `
        html, body {
            -webkit-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;          /* iPhone: no long-press callout */
            -webkit-tap-highlight-color: transparent;
        }
        img { -webkit-user-drag: none; }
        ${ALLOW.split(',').map(s => `${s.trim()}, ${s.trim()} *`).join(',\n        ')} {
            -webkit-user-select: text;
            user-select: text;
            -webkit-touch-callout: default;
        }
    `;
    document.head.appendChild(style);

    // Android long-press / right-click menu (also covers "Save image" on photos).
    document.addEventListener('contextmenu', (e) => {
        if (e.target instanceof Element && e.target.closest(ALLOW)) return;
        e.preventDefault();
    }, { capture: true });
})();