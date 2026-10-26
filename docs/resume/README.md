# Resume V2.2

保留原白底、蓝色强调、时间分栏与响应式设计。src/data/resume.json 是网页与公开PDF共同内容源；PDF可使用pdfText精简或pdfOmit选择。数据或PDF变化未同步manifest将阻止构建。正文10.5pt，14pt行距，原V2版式和真实照片。

正式文字突出行动、方法、结果，保留个人GMV与项目渠道线索范围；不展示内部归因备注及低价值历史播放统计。原始事实、审核边界保存在本地Resume Engine，不发布到网站。公开PDF沿用邮箱联系、隐藏完整手机号的既有策略。

修改后运行 scripts/export-public-resume.py，检查.resume-review/pdf/page-1.png，再build。scripts/test-resume-browser.cjs验证1440/390/320宽度、直达刷新、案例、邮箱、无横溢出、下载与预览，支持RESUME_TEST_URL。根路径与Pages路径均须验证。测试覆盖Chromium桌面/移动视口，非实体手机承诺。

Resume路由在生产main上最小接入，保留最新生产主页、Story、Fun与现有案例；仅接入Resume。部署继续使用既有Pages/阿里云Actions，不修改服务器或凭证。当前源码仅有两个已证实AI项目，不为凑项目数量添加未获证实的材料。
