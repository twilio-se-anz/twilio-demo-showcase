import {
  Avatar,
  Badge,
  Box,
  Text,
  Card,
  Heading,
  Paragraph,
  Stack,
  Column,
  Grid,
  UnorderedList,
  ListItem,
  Button,
  ButtonGroup,
} from "@twilio-paste/core";

import { UserIcon } from "@twilio-paste/icons/cjs/UserIcon";
import { Listing } from "../../serverless/functions/api/data";
import { useAnalytics } from "../Analytics";
import Moment from "react-moment";

export interface ListingPageProps {
  listing: Listing;
  setSelected: any;
}

export const ListingPage: React.FC<ListingPageProps> = (
  props: ListingPageProps
) => {
  const analytics = useAnalytics();

  return (
    <>
      <Box
        padding="space50"
        style={{
          width: "100%",
        }}
      >
        <Heading as="h2" variant="heading20">
          {props.listing.name}
        </Heading>
        <Stack orientation={"vertical"} spacing={"space50"}>
          <Grid gutter="space30">
            <Column span={8}>
              <Box
                alignContent={"center"}
                style={{
                  backgroundColor: "#333333",
                  textAlign: "center",
                }}
              >
                <div className="fill-large">
                  {props.listing.image && (
                    <img src={props.listing.image} width="1000px" />
                  )}
                  {!props.listing.image && (
                    <img src={"twilio.png"} width="600px" />
                  )}
                </div>
              </Box>
            </Column>

            <Column span={4}>
              <Card padding="space70">
                <Heading as="h2" variant="heading30">
                  Description
                </Heading>
                <Paragraph>
                  {props.listing.description ||
                    "Check out the demo link to view this demo."}
                </Paragraph>

                <Heading as="h2" variant="heading40">
                  Tags and Categories
                </Heading>
                <Text as={"div"} marginBottom={"space50"}>
                  {props.listing.tags && (
                    <UnorderedList>
                      {props.listing.tags.map((tag) => (
                        <ListItem key={tag}>{tag}</ListItem>
                      ))}
                    </UnorderedList>
                  )}
                </Text>

                {props.listing.products && (
                  <>
                    <Heading as="h2" variant="heading40">
                      Products
                    </Heading>
                    <Text as={"div"} marginBottom={"space50"}>
                      <Box
                        display="flex"
                        columnGap="space40"
                        rowGap="space40"
                        flexWrap="wrap"
                      >
                        {props.listing.products &&
                          props.listing.products.map((product) => (
                            <Badge key={product} as="span" variant="new">
                              {product}
                            </Badge>
                          ))}
                      </Box>
                    </Text>
                  </>
                )}

                {props.listing.flags && (
                  <>
                    <Heading as="h2" variant="heading40">
                      Flags
                    </Heading>
                    <Text as={"div"} marginBottom={"space50"}>
                      <Box display="flex" columnGap="space80">
                        {props.listing.flags &&
                          props.listing.flags.map((flag) => (
                            <Badge key={flag} as="span" variant="error">
                              {flag}
                            </Badge>
                          ))}
                      </Box>
                    </Text>
                  </>
                )}

                <Heading as="h2" variant="heading40" marginBottom="space0">
                  Publisher
                </Heading>
                <Text as={"div"} marginBottom={"space30"}>
                  <Stack orientation={"horizontal"} spacing={"space30"}>
                    <Avatar size="sizeIcon50" name="" icon={UserIcon} />
                    <p>{props.listing.owner}</p>
                  </Stack>
                </Text>

                <Heading as="h2" variant="heading40">
                  Listing Last Modified
                </Heading>
                <Text as={"div"} marginBottom={"space50"}>
                  <Moment date={props.listing.last_modified} fromNow />
                </Text>

                <Heading as="h2" variant="heading40">
                  Details and Installation
                </Heading>
                <Text as={"div"} marginBottom={"space30"}>
                  The button below may take you you to an external website not
                  provided by Twilio.
                </Text>
                <ButtonGroup>
                  <Button
                    as="a"
                    target={"_blank"}
                    href={props.listing.repo}
                    onClick={() => {
                      analytics.track("View Listing", { ...props.listing });
                    }}
                    variant="primary"
                  >
                    Open demo
                  </Button>

                  {props.listing.slides && (
                    <Button
                      as="a"
                      target={"_blank"}
                      href={props.listing.slides}
                      onClick={() => {
                        analytics.track("View Listing", { ...props.listing });
                      }}
                      variant="secondary"
                    >
                      Open Slides
                    </Button>
                  )}
                </ButtonGroup>
              </Card>
            </Column>
          </Grid>
        </Stack>
      </Box>
    </>
  );
};
