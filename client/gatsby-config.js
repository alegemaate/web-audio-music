module.exports = {
  pathPrefix: "/web-audio-music",
  plugins: [
    {
      options: {
        name: "images",
        path: `${__dirname}/src/images`,
      },
      resolve: "gatsby-source-filesystem",
    },
    {
      options: {
        background_color: "#dbb700",
        display: "standalone",
        icon: "src/images/favicon.png",
        name: "Allan's Web Audio Playground",
        short_name: "Allan's Web Audio",
        start_url: "/",
        theme_color: "#dbb700",
      },
      resolve: "gatsby-plugin-manifest",
    },
    {
      options: {
        allExtensions: true,
        isTSX: true,
        jsxPragma: "jsx",
      },
      resolve: "gatsby-plugin-typescript",
    },
  ],
  siteMetadata: {
    author: "alegemaate@gmail.com",
    description: "Allan's Web Audio Playground",
    title: "Allan's Web Audio Playground",
  },
};
