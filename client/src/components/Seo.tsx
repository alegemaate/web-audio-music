import React from "react";
import { useSiteMetadata } from "../hooks/use-site-metadata";

interface SeoProps {
  title: string;
  description?: string;
  pathname?: string;
  children?: React.ReactNode;
}

export const Seo: React.FC<SeoProps> = ({
  title,
  description,
  pathname,
  children,
}) => {
  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl,
    twitterUsername,
  } = useSiteMetadata();

  const seo = {
    title: `${title} | ${defaultTitle}`,
    description: description ?? defaultDescription,
    url: `${siteUrl}${pathname ?? ""}`,
    twitterUsername,
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:creator" content={seo.twitterUsername} />
      {children}
    </>
  );
};
