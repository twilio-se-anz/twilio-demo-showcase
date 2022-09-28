import Head from "next/head";
import type { NextPage } from "next";
import { Box } from "@twilio-paste/core/box";

import React, { useState } from "react";
import {
  Column,
  Flex,
  Heading,
  Paragraph,
  SkeletonLoader,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@twilio-paste/core";
import { Header } from "../components/Header";
import { PluginListing } from "../serverless/functions/api/data";
import { Listings } from "../components/Listings";
import { LoadingCard } from "../components/LoadingCard";

const Home: NextPage = () => {
  const [tab, setTab] = React.useState("existing-tab");
  const selectedId = "1";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<PluginListing>>();
  const [tags, setTags] = useState<string[]>();

  React.useEffect(() => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      fetch(baseUrl + "api/data")
        .then((result) => result.json())
        .then((result) => {
          setData(result);
          const tags: Array<string> = Array<string>();
          result.map((item: PluginListing) => {
            if (!item.tags) return;
            item.tags.map((tag) => tags.push(tag));
          });
          const unique_tags: string[] = [...new Set<string>(tags)]; // [ 'A', 'B']
          unique_tags.sort((a, b) => a.localeCompare(b));
          console.log("Unique tags", unique_tags);
          setTags(unique_tags);
          setLoading(false);
        });
    } catch (err) {
      console.log("Error fetching listing data");
    }
  }, []);

  let loader = [1, 2, 3, 4, 5, 6];

  if (loading)
    return (
      <Box
        alignContent={"center"}
        verticalAlign={"middle"}
        padding={"space30"}
        marginBottom="space30"
        height={"100vh"}
      >
        <Flex hAlignContent="center" vertical>
          <Flex>
            <Stack orientation={"horizontal"} spacing={"space100"}>
              <Spinner decorative={false} title="Loading" size="sizeIcon80" />
              <Paragraph>Loading...</Paragraph>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    );

  return (
    <>
      <Head>
        <title>Showcase</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Box padding={"space50"}>
        <Tabs
          orientation="vertical"
          selectedId={selectedId}
          baseId="vertical-tabs-example"
        >
          <TabList aria-label="Vertical product tabs">
            <Tab id={selectedId}>(All)</Tab>
            {tags && tags.map((name) => <Tab key={name}>{name}</Tab>)}
          </TabList>

          <TabPanels>
            <TabPanel>
              <Heading as={"div"} variant={"heading10"}>
                All Plugins
              </Heading>
              <Listings data={data} />
              {loading &&
                loader.map((i) => (
                  <Column key={i} span={4} element="LISTINGCARD">
                    <LoadingCard />
                  </Column>
                ))}
            </TabPanel>
            {tags &&
              tags.map((name) => (
                <TabPanel key={name}>
                  <Heading as={"div"} variant={"heading10"}>
                    {name}
                  </Heading>
                  <Listings
                    data={data.filter((item) => item.tags?.includes(name))}
                  />
                </TabPanel>
              ))}
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
};

export default Home;
