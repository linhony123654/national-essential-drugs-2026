# 国家基本药物目录（2026年版）

国家基本药物目录数据可视化检索平台。收录化学药品和生物制品 476 个品种、中成药 318 个品种，支持全文检索、多维筛选与数据洞察。

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS v3 + shadcn/ui
- GSAP（ScrollTrigger）+ Framer Motion 动效
- Lenis 平滑滚动、Recharts 图表

## 本地运行

```bash
npm install
npm run dev
```

开发服务器默认运行在 http://localhost:3000

## 页面

- 首页：目录总览、构成、品种速览
- 药品检索（/drugs）：816 条目录记录全文检索，大类/亚类/△ 标记筛选，表格与卡片视图
- 数据洞察（/insights）：总量构成、大类分布、特殊管理品种、剂型分布
- 目录说明（/guide）：定义、标记说明、注释全文、中药饮片政策

## 数据来源

《国家基本药物目录（2026年版）》，国家卫生健康委员会发布。目录数据位于 `public/drugs.json`。本网站为数据可视化演示，目录内容以官方正式发布为准。
