import Head from "next/head";
import type { NextPage } from "next";
import { Box } from "@twilio-paste/core/box";

import React, { useState, useEffect } from "react";
import {
  Column,
  Flex,
  Heading,
  Paragraph,
  Spinner,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useTabState,
} from "@twilio-paste/core";
import { Header } from "../components/Header";
import { PluginListing } from "../serverless/functions/api/data";
import { Listings } from "../components/Listings";
import { LoadingCard } from "../components/LoadingCard";

const Home: NextPage = () => {
  const tabsBaseId = 'category-tabs';
  const selectedId = `${tabsBaseId}-9`;

  const currentTab = useTabState({ baseId: tabsBaseId, currentId: selectedId });

  useEffect(() => {
    console.log('tab selection changed', currentTab);
  }, [currentTab])

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<PluginListing>>();
  const [tags, setTags] = useState<string[]>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
        const response = await fetch(baseUrl + "api/data");

        if (!response.ok) {
          throw new Error(
            `Error getting listing data: ${response.status} - ${response.statusText}`
          );
        }

        const listingData = await response.json();

        setData(listingData);

        const tags: Array<string> = Array<string>();
        listingData.map((item: PluginListing) => {
          if (!item.tags) return;
          item.tags.map((tag) => tags.push(tag));
        });

        const unique_tags: string[] = [...new Set<string>(tags)]; // [ 'A', 'B']
        unique_tags.sort((a, b) => a.localeCompare(b));
        console.log("Unique tags", unique_tags);
        setTags(unique_tags);
        setLoading(false);
      }

      catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    fetchData();
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
          baseId={tabsBaseId}
          state={currentTab}
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
