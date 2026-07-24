/* Reader 嵌套评论样式优化 */
.comment-item-wrapper {
    transition: background-color 0.2s;
}
.comment-item-wrapper:hover {
    background-color: #f0f8ff; /* 只有非白色背景的评论才会稍微变蓝，保持原有淡雅风格 */
}

/* 子评论区域 */
.comment-children {
    /* 子评论不需要额外的 margin，因为在 renderCommentTree 里已经对子节点加了 margin-left */
}

/* 调整原有 comment-item 以适应新结构 */
.comment-item {
    display: flex;
    gap: 0.8rem;
    margin-bottom: 0; /* 由 wrapper 控制间距 */
}
