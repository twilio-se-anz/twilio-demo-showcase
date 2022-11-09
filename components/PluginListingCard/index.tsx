import {
  Alert,
  Avatar,
  Badge,
  Box,
  Text,
  Card,
  Heading,
  Paragraph,
  Stack,
  Anchor,
} from "@twilio-paste/core";

import Link from "next/link";

import { UserIcon } from "@twilio-paste/icons/cjs/UserIcon";
import { PluginListing } from "../../serverless/functions/api/data";
import { useAnalytics } from "../Analytics";

export interface MediaCardProps {
  listing: PluginListing;
}

export const PluginListingCard: React.FC<MediaCardProps> = (
  props: MediaCardProps
) => {
  const analytics = useAnalytics();

  return (
    <Card padding="space50">
      <Stack orientation={"vertical"} spacing={"space50"}>
        <Box
          alignContent={"center"}
          style={{
            width: "100%",
            backgroundColor: "whitesmoke",
            textAlign: "center",
          }}
        >
          <div className="fill">
            {props.listing.image && (
              <img src={props.listing.image} width="300px" />
            )}
            {!props.listing.image && <img src={"twilio.png"} width="300px" />}
          </div>
        </Box>

        <Heading as={"div"} variant={"heading30"}>
          {props.listing.name}
        </Heading>

        {(props.listing.products || props.listing.flags) && (
          <Box display="flex" columnGap="space80">
            {props.listing.products &&
              props.listing.products.map((product) => (
                <Badge key={product} as="span" variant="new">
                  {product}
                </Badge>
              ))}
            {props.listing.flags &&
              props.listing.flags.map((flag) => (
                <Badge key={flag} as="span" variant="error">
                  {flag}
                </Badge>
              ))}
          </Box>
        )}

        <Stack orientation={"horizontal"} spacing={"space30"}>
          <Avatar size="sizeIcon50" name="" icon={UserIcon} />
          <p>{props.listing.owner}</p>
        </Stack>

        <Paragraph>
          {props.listing.description ||
            "Check out the source repository to see more information about this plugin."}
        </Paragraph>

        {props.listing.repo && (
          <Anchor
            target={"_blank"}
            href={props.listing.repo}
            onClick={() => {
              analytics.track("View Listing", { ...props.listing });
            }}
          >
            Find the code here
          </Anchor>
        )}

        {props.listing.tags && (
          <Box display="flex" columnGap="space80">
            {props.listing.tags.map((tag) => (
              <Badge key={tag} as="span" variant="neutral">
                {tag}
              </Badge>
            ))}
          </Box>
        )}
      </Stack>
    </Card>
  );
};
