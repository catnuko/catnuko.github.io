import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "星野",
  lastName: "",
  name: "星野",
  role: "程序员 & 摄影师",
  avatar: "",
  email: "346746061@qq.com",
  location: "Asia/Shanghai",
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
  description: `程序员、摄影师、写作者 — ${person.name} 的个人网站`,
  headline: <>用代码构建，用镜头记录</>,
  featured: {
    display: false,
    title: <></>,
    href: "/work",
  },
  subline: (
    <>
      我是 <Text as="span" weight="strong">{person.name}</Text>，一个程序员，也是摄影师。<br />
      这里记录了我的代码、照片和思考。
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "关于",
  title: `关于 – ${person.name}`,
  description: `了解 ${person.name} — 程序员与摄影师`,
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
        {person.name} 是一名程序员和摄影师，热爱用代码创造工具，
        用镜头捕捉光影。这里记录了他的技术探索、摄影作品和生活思考。
      </>
    ),
  },
  work: {
    display: false,
    title: "工作经历",
    experiences: [],
  },
  studies: {
    display: false,
    title: "教育",
    institutions: [],
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
