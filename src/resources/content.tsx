import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "邱振宇",
  lastName: "",
  name: "邱振宇",
  role: "WebGIS 开发工程师 & 摄影师",
  avatar: "",
  email: "346746061@qq.com",
  location: "Asia/Shanghai",
  address: "湖北省武汉市",
  languages: ["中文"],
  locale: "zh-CN",
};

const newsletter: Newsletter = {
  display: false,
  title: <></>,
  description: <></>,
};

const social: Social = [
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
    essential: true,
  },
];

const home: Home = {
  path: "/",
  image: "",
  label: "首页",
  title: `${person.name} 的个人网站`,
  description: `WebGIS 开发工程师、摄影师、写作者 — ${person.name} 的个人网站`,
  headline: <>用代码构建数字地球，用镜头记录世界</>,
  featured: {
    display: false,
    title: <></>,
    href: "/work",
  },
  subline: (
    <>
      我是 <Text as="span" weight="strong">{person.name}</Text>，一个 WebGIS 开发工程师，也是摄影师。<br />
      这里记录了我的代码、照片和思考。
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "关于",
  title: `关于 – ${person.name}`,
  description: `了解 ${person.name} — WebGIS 开发工程师与摄影师`,
  tableOfContent: {
    display: false,
    subItems: false,
  },
  avatar: {
    display: false,
  },
  calendar: {
    display: false,
    link: "",
  },
  intro: {
    display: true,
    title: "介绍",
    description: (
      <>
        从河南大学地理信息工程专业毕业后，我就一头扎进了 WebGIS 的世界——
        从二维地图到三维地球，一做就是 {new Date().getFullYear() - 2020} 年。
        <br /><br />
        我是那种会把技术文档当小说读的人，尤其在 Cesium、MapLibre 这些引擎里，
        总能挖到让人兴奋的东西。代码之外，我也喜欢端着相机出门，
        用快门代替鼠标，去记录这个世界。
        <br /><br />
        这个网站就是我这两面的交汇点。如果你也对 WebGIS 或摄影感兴趣，欢迎进来坐坐。
      </>
    ),
  },
  work: {
    display: false,
    title: "工作经历",
    experiences: [],
  },
  studies: {
    display: true,
    title: "教育",
    institutions: [
      {
        name: "河南大学",
        description: (
          <>
            地理信息工程专业 · 本科 · 2016 – 2020
          </>
        ),
      },
    ],
  },
  technical: {
    display: false,
    title: "技能",
    skills: [],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "文章",
  title: "技术写作与思考...",
  description: `阅读 ${person.name} 的文章`,
};

const work: Work = {
  path: "/work",
  label: "项目",
  title: `项目 – ${person.name}`,
  description: `${person.name} 的设计和开发项目`,
};

const gallery: Gallery = {
  path: "/gallery",
  label: "摄影",
  title: `摄影作品 – ${person.name}`,
  description: `${person.name} 的摄影作品集`,
  images: [
    {
      src: "/photos/p1.jpg",
      alt: "树影长影",
      orientation: "horizontal",
    },
    {
      src: "/photos/p2.jpg",
      alt: "海岸岩石",
      orientation: "horizontal",
    },
    {
      src: "/photos/p3.jpg",
      alt: "孤独的身影",
      orientation: "vertical",
    },
    {
      src: "/photos/p4.jpg",
      alt: "浪潮",
      orientation: "horizontal",
    },
    {
      src: "/photos/p5.jpg",
      alt: "海景观景",
      orientation: "horizontal",
    },
    {
      src: "/photos/p6.jpg",
      alt: "礁石海岸",
      orientation: "horizontal",
    },
    {
      src: "/photos/p7.jpg",
      alt: "山脉远景",
      orientation: "horizontal",
    },
    {
      src: "/photos/p8.jpg",
      alt: "山峰之巅",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
