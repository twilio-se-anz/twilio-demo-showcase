import Head from "next/head";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import { Box } from "@twilio-paste/core/box";
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

const Home: NextPage = () => {
  const tabsBaseId = 'category-tabs';

  const router = useRouter();
  const tab = useTabState({ baseId: tabsBaseId });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<PluginListing>>();
  const [tags, setTags] = useState<string[]>();

  // When the selected tab changes then we update the route if required
  useEffect(() => {
    const tabIndex = +tab.selectedId?.substring(tabsBaseId.length + 1);

    if (typeof tabIndex === 'number' && !loading) {
      // tabs start at 1 https://twitter.com/codinghorror/status/506010907021828096?lang=en
      const tag = tags[tabIndex - 1];

      // prevent a loop && don't overwrite the route on initial navigation
      if (router.query.tag !== tag) {
        const newQuery = { tag }
        console.log('tab changed, updating route query', newQuery);
        router.push({ query: newQuery });
      }
    }
  }, [tab.selectedId]);

  // When the route changes then we update the selected tab
  useEffect(() => {
    if (tab.selectedId && typeof router.query.tag === 'string') {
      console.log(`searching tabs for ${router.query.tag}`);
      const tagIndex = tags.findIndex((t) => t === router.query.tag)
      if (tagIndex >= 0) {
        console.log('router.query changed, updating tab to', tags[tagIndex]);
        // tabs start at 1 https://twitter.com/codinghorror/status/506010907021828096?lang=en
        tab.select(`${tabsBaseId}-${tagIndex + 1}`);
      }
    }
  }, [router.query]);

  // After the tags are loaded, check route for selected tag
  useEffect(() => {
    if (router.query.tag && typeof router.query.tag === 'string') {
      const tagIndex = tags.findIndex((t) => t === router.query.tag)
      if (tagIndex >= 0) {
        console.log('tags changed, updating selected tab to match query', tags[tagIndex]);
        // tabs start at 1 https://twitter.com/codinghorror/status/506010907021828096?lang=en
        tab.select(`${tabsBaseId}-${tagIndex + 1}`);
      }
    }
  }, [tags])


  // Load data, runs once
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

        // Add "All" to the top of the list
        unique_tags.unshift("All Plugins");
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
          state={tab}
        >
          <TabList aria-label="Vertical product tabs">
            {tags && tags.map((name, index) => <Tab key={name}>{index === 0 ? `[${name}]` : name}</Tab>)}
          </TabList>

          <TabPanels>
            {tags &&
              tags.map((name, index) => (
                <TabPanel key={name}>
                  <Heading as={"div"} variant={"heading10"}>
                    {name}
                  </Heading>
                  <Listings
                    data={index === 0 ? data : data.filter((item) => item.tags?.includes(name))}
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
