"use client";

import {
  Column,
  Heading,
  Media,
  Row,
  SmartLink,
  Text,
} from "@once-ui-system/core";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
}) => {
  const isExternal = link.startsWith("http");

  return (
    <SmartLink
      href={link || href}
      className={styles.card}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      <Row
        fillWidth
        s={{ direction: "column" }}
        radius="l"
        border="neutral-alpha-weak"
        background="neutral-weak"
        style={{ overflow: "hidden", minHeight: "3.5rem" }}
      >
        {images.length > 0 && (
          <Row
            s={{ style: { width: "auto" } }}
            width={16}
            height={12}
            style={{ flexShrink: 0, overflow: "hidden" }}
          >
            <Media
              priority
              sizes="(max-width: 800px) 100vw, 20vw"
              alt={title}
              src={images[0]}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Row>
        )}
        <Column
          fillWidth
          paddingX="m"
          paddingY="8"
          gap="4"
          flex={3}
          vertical="center"
          style={{ minWidth: 0 }}
        >
          <Row fillWidth vertical="center" gap="s">
            {title && (
              <Heading
                as="h3"
                wrap="balance"
                variant="heading-strong-xs"
                className={styles.ellipsis}
              >
                {title}
              </Heading>
            )}
          </Row>
          {description?.trim() && (
            <Text
              variant="body-default-xs"
              onBackground="neutral-weak"
              className={styles.ellipsis}
            >
              {description}
            </Text>
          )}
        </Column>
        {(content?.trim() || link) && (
          <Row
            paddingX="m"
            paddingY="8"
            gap="16"
            vertical="center"
            s={{ hide: true }}
            style={{ flexShrink: 0 }}
          >
            {content?.trim() && (
              <Text variant="label-default-s" onBackground="brand-weak">
                →
              </Text>
            )}
          </Row>
        )}
      </Row>
    </SmartLink>
  );
};
