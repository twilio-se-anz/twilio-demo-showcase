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
  CalloutHeading,
  Callout,
  CalloutText,
} from "@twilio-paste/core";

import moment from "moment";

import { UserIcon } from "@twilio-paste/icons/cjs/UserIcon";
import { PluginListing } from "../../serverless/functions/api/data";
import { useAnalytics } from "../Analytics";
import Moment from "react-moment";

export interface MediaCardProps {
  listing: PluginListing;
  setSelected: any;
}

export const PluginListingCard: React.FC<MediaCardProps> = (
  props: MediaCardProps
) => {
  const analytics = useAnalytics();

  const date_now = new Date();
  const date_updated = new Date(props.listing.last_modified);

  let difference = date_now.getTime() - date_updated.getTime();
  let days = Math.ceil(difference / (1000 * 3600 * 24));

  return (
    <Card padding="space50">
      <Stack orientation={"vertical"} spacing={"space50"}>
        {days <= 30 && (
          <Callout variant="new">
            <CalloutHeading as="h3">
              Recently updated{" "}
              <Moment date={props.listing.last_modified} fromNow />!
            </CalloutHeading>
          </Callout>
        )}

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
          <p>{props.listing.owner} </p>
        </Stack>

        <Paragraph>
          {props.listing.description ||
            "Check out the source repository to see more information about this plugin."}
        </Paragraph>

        <Paragraph>
          Last modified{" "}
          <strong>
            <Moment date={props.listing.last_modified} fromNow />
          </strong>
        </Paragraph>

        {props.listing.repo && (
          <Anchor
            href={"?listing=" + encodeURIComponent(props.listing.name)}
            onClick={(e) => {
              e.preventDefault();
              analytics.track("View Detail", { ...props.listing });
              props.setSelected(props.listing);
            }}
          >
            View details
          </Anchor>
        )}

        {/* {props.listing.tags && (
          <Box display="flex" columnGap="space80">
            {props.listing.tags.map((tag) => (
              <Badge key={tag} as="span" variant="neutral">
                {tag}
              </Badge>
            ))}
          </Box>
        )} */}
      </Stack>
    </Card>
  );
};
