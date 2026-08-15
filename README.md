# IWP inputwenben please 请输入文本

[![Website](https://img.shields.io/badge/gumingdilian--hub.github.io%2Finput-F8B8C8?style=for-the-badge)](https://gumingdilian-hub.github.io/input/)

![License](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey)
![Status](https://img.shields.io/badge/status-updating-lightgrey)

作者 cz 河北廊坊生人，衡水二中熟人，2025 届生物竞赛省一。

本仓库收录了生物竞赛完整笔记，涵盖生物化学、细胞生物学、动物生理学、遗传学、进化生物学、生态行为、生物信息学等核心模块，以及高等数学、Linux 命令行等扩展内容。笔记质量介于神与屎之间，既有大量屎总结，也包含对你的喜爱❤️。

暂不考虑参加万国展览会，诺贝尔文学奖，诺贝尔生理学或医学奖

## 内容目录

- **生物化学** 
- **细胞生物学** 
- **动物生理学** 
- **遗传学** 
- **分子生物学** 
- **进化生物学**
- **生态行为** 
- **生物信息学** 
- **高等数学** 
- **微生物学**
- **免疫学** 

## 阅读须知

- 要是需要Word版，请访问，尽量使用金山文档，避免排版问题，无论如何也要使用金山系软件打开，edge，chorme，Firefox大概率有问题。更新不及时是必然的，想看什么私信我即可，这个网站大概率我会一直用到研究生毕业
- **金山文档**  [![WPS文档](https://img.shields.io/badge/📄-WPS云盘-F8B8C8?style=flat&logo=wps&logoColor=white)](https://www.kdocs.cn/l/cpfoz8aFZG1W)
- **微软云盘**  [![Word文档](https://img.shields.io/badge/📄-OneDrive-F8B8C8?style=flat&logo=microsoftword&logoColor=white)](https://1drv.ms/w/c/E80A9C3926A748E4/IQDY1QmwfksZTLGkeJNP5R2aAQp-wJraOPEXENFudMulza4)
- **百度网盘**  [![百度网盘](https://img.shields.io/badge/📄-百度网盘-F8B8C8?style=flat&logo=link&logoColor=white)](https://pan.baidu.com/s/1OkC4QJYL8HxJoa-0FbjfBw) 提取码:7i0f
- **夸克网盘**  [![夸克网盘](https://img.shields.io/badge/📄-夸克网盘-F8B8C8?style=flat&logo=link&logoColor=white)](https://pan.quark.cn/s/705378c1f4bf)
- 下下来尽量使用WPS**汉仪书宋二简**
- 电子版推荐字体：**Word版务必使用汉仪书宋二简**（打印务必切换，版权归北京汉仪科印信息技术有限公司所有）
- 本文档开源协议：**CC BY-NC-SA 4.0**,不遵守小心我拿神威无敌大将军炮轰似你

## 联系方式

- WeChat：15530600783
- Email：2167964516@qq.com
- Gmail：mahirooyama@gmail.com
- GitHub：[gumingdilian-hub](https://github.com/GumingDilian-hub)

## 主播主播，我也想用这个网站写笔记怎么办

- 有的兄弟有的，我们这个笔记和网站本体是全分离的
- 如果你一点信息技术也不会（毕竟是生物竞赛），按照以下教程
- 1，创建你的GitHub账号
- 2，把这个仓库fork到你自己的账号名下
- 3，你可以DIY的大概有两个文件夹，一个是images，其下0721.png决定网站图标，images/00x用于插入图片。一个是notes，其下00x存放笔记内容
- 4，notes采用markdown变种，没必要专门去学，把下面这个提示词复制给AI，再把你的笔记贴给AI，AI就可以帮你转化了
- 你要是听不懂，或者极端情况下可以把这个文件发给AI   [![OneDrive文档](https://img.shields.io/badge/📄-技术文件-0078D4?style=flat&logo=microsoftword&logoColor=white)](https://1drv.ms/w/c/E80A9C3926A748E4/IQDFIssarrO3QYHFpVLauDVEAbLxCO8TRLcDMK5JKGl0R48)
````markdown
你是一位文档格式转换专家，请将用户提供的原始笔记内容，按照以下 **IWP 项目规范** 进行转换。

## 转换规则

1. **添加 YAML Front Matter（元数据块）**
   - 在文档最顶部用 `---` 包裹以下字段：
     ```yaml
     ---
     title: 从原文提取的标题
     date: 当前日期（格式 YYYY-MM-DD）
     version: 1.0
     tags: [关键词1, 关键词2]
     ---
     ```

2. **图片处理（两种语法）**
   - **需要图注的图片** → 使用 `:::image` 块，格式为 `:::image 对齐方式 文件名 图注文字 :::`。
   - **不需要图注的图片** → 使用标准 `![]()` 并追加 `{对齐方式}` 修饰符，格式为 `![描述](文件名){对齐方式}`。
   - 对齐方式可选：`center`（居中）、`left`（左浮）、`right`（右浮）、`around`（四周环绕）。
   - **路径规则**：图片只写文件名（如 `flow.png`），不加 `images/` 前缀。

3. **章节结构**
   - 一级标题 `#` 对应章节，二级 `##`、三级 `###` 作为子标题。

---

## 转换示例（请严格模仿此示例的输出格式）

### 示例输入（用户原始笔记）
```text
# 细胞实验记录
今天做了 Western Blot，结果如下图。

[图片：wb_result.jpg]
图1：蛋白条带

还有一张对比图放在右侧比较好看。
[图片：control.jpg]

数据统计如下：
| 组别 | 表达量 |
|------|--------|
| 实验组 | 1.8 |
| 对照组 | 1.0 |
```

### 示例输出（转换后的 IWP 格式）
```markdown
---
title: 细胞实验记录
date: 2026-08-15
version: 1.0
tags: [Western Blot, 蛋白表达]
---

# 细胞实验记录

今天做了 Western Blot，结果如下图。

:::image center wb_result.jpg 图1：蛋白条带 :::

还有一张对比图放在右侧比较好看。

![对比图](control.jpg){right}

数据统计如下：

| 组别 | 表达量 |
|------|--------|
| 实验组 | 1.8 |
| 对照组 | 1.0 |
```

---

## 现在开始转换

请严格按照上述示例的输出格式，将用户下方提供的笔记内容转换为 IWP 格式。只输出转换后的 Markdown 源码，结果使用代码块包裹，不要添加额外解释。

用户笔记内容如下：
````
- 5 完事把转化完的贴到notes里即可，000代表序言的文本，你想插入什么图片，就直接按照转化完的md命名即可，比如说我的001.md里有个005.png想插进去，直接把图片上传到images/000/005.png即可
- 6 完事你写完了，就可以让网站上线了，先点setting－Pages，把那个d打头的改成main保存，然后去action，此时你应该会发现它在转圈圈，转完了点进去即可显示出你的网站
- 7实际上你什么不会都可以问AI，你可以把我的仓库链接贴给AI，哪里出问题都可以解决！
---

*本站基于 神秘东方文字（其实就是HTML CSS JS）搭建*
