import {
  Avatar,
  Badge,
  Box,
  Card,
  Heading,
  Paragraph,
  Stack,
} from "@twilio-paste/core";

import Link from "next/link";

import { UserIcon } from "@twilio-paste/icons/cjs/UserIcon";
import { PluginListing } from "../../common/types";

export interface MediaCardProps {
  listing: PluginListing;
}

export const PluginListingCard: React.FC<MediaCardProps> = (
  props: MediaCardProps
) => {
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
        <Stack orientation={"horizontal"} spacing={"space30"}>
          <Avatar size="sizeIcon50" name="" icon={UserIcon} />
          <p>{props.listing.owner}</p>
        </Stack>

        <Paragraph>
          {props.listing.description ||
            "Check out the source repository to see more information about this plugin."}
        </Paragraph>

        {props.listing.repo && (
          <Link href={props.listing.repo}>Visit Repository</Link>
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
