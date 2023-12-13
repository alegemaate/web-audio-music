import { graphql, useStaticQuery } from "gatsby";

export interface SiteMetadata {
  title: string;
  description: string;
  twitterUsername: string;
  siteUrl: string;
}

export const useSiteMetadata = (): SiteMetadata => {
  const data = useStaticQuery<{
    site: {
      siteMetadata: SiteMetadata;
    };
  }>(graphql`
    query {
      site {
        siteMetadata {
          title
          description
          twitterUsername
          siteUrl
        }
      }
    }
  `);

  return data.site.siteMetadata;
};
