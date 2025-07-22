import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import type { NextPage } from "next";

import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Paragraph,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useTabState,
  Box,
  Card,
  SkeletonLoader,
} from "@twilio-paste/core";

import { Header } from "../components/Header";
import { Listing } from "../serverless/functions/api/data";
import { Listings } from "../components/Listings";
import { useAnalytics } from "../components/Analytics";
import { ListingPage } from "../components/ListingPage";

const Home: NextPage = () => {
  const tabsBaseId = "category-tabs";
  const router = useRouter();
  const tab = useTabState({ baseId: tabsBaseId });
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Array<Listing>>();
  const [tags, setTags] = useState<string[]>();
  const [selected, _setSelected] = useState<Listing>();

  const analytics = useAnalytics();
  const onActivateTab = (tag) => {
    console.log("On Activate Tab", tag);
    analytics.track("View Tag", { tag: tag });
    _setSelected(undefined);
    router.push({ query: { tag: tag } });
  };

  const onSetSelected = (listing: Listing) => {
    _setSelected(listing);
    router.push({ query: { listing: listing.name } });
  };

  React.useEffect(() => {
    analytics.page();
  }, []);

  // When the route changes then we update the selected tab or choose a listing
  useEffect(() => {
    // Tags
    if (tab.selectedId && typeof router.query.tag === "string") {
      console.log(`searching tabs for ${router.query.tag}`);
      const tagIndex = tags.findIndex((t) => t === router.query.tag);
      if (tagIndex >= 0) {
        console.log(
          "router.query.tag changed, updating tab to",
          tags[tagIndex]
        );
        // tabs start at 1 https://twitter.com/codinghorror/status/506010907021828096?lang=en
        tab.select(`${tabsBaseId}-${tagIndex + 1}`);
      }
    }
  }, [router.query.tag]);

  // When the route changes then we update the selected tab or choose a listing
  useEffect(() => {
    // Specific listing
    if (data && typeof router.query.listing === "string") {
      console.log(`searching listings for ${router.query.listing}`);

      const listingIndex = data.findIndex(
        (entry) => entry.name === router.query.listing
      );
      if (listingIndex >= 0) {
        console.log(
          "router.query.listing changed, showing listing ",
          data[listingIndex]
        );
        onSetSelected(data[listingIndex]);
      }
    }
  }, [router.query.listing]);

  // After the tags are loaded, check route for selected tag
  useEffect(() => {
    if (router.query.tag && typeof router.query.tag === "string") {
      const tagIndex = tags.findIndex((t) => t === router.query.tag);
      if (tagIndex >= 0) {
        console.log(
          "tags changed, updating selected tab to match query",
          tags[tagIndex]
        );
        // tabs start at 1 https://twitter.com/codinghorror/status/506010907021828096?lang=en
        tab.select(`${tabsBaseId}-${tagIndex + 1}`);
      }
    }
  }, [tags]);

  // After the data are loaded, check route for selected listing
  useEffect(() => {
    // Specific listing
    if (data && typeof router.query.listing === "string") {
      console.log(`searching listings for ${router.query.listing}`);

      const listingIndex = data.findIndex(
        (entry) => entry.name === router.query.listing
      );
      if (listingIndex >= 0) {
        console.log(
          "data loaded/changed, showing listing ",
          data[listingIndex]
        );
        onSetSelected(data[listingIndex]);
      }
    }
  }, [data]);

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
        listingData.map((item: Listing) => {
          if (!item.tags) return;
          item.tags.map((tag) => tags.push(tag));
        });

        const unique_tags: string[] = [...new Set<string>(tags)]; // [ 'A', 'B']
        unique_tags.sort((a, b) => a.localeCompare(b));

        // Add "All" to the top of the list
        unique_tags.unshift("All Listings");
        unique_tags.unshift("What's New?");

        console.log("Unique tags", unique_tags);
        setTags(unique_tags);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let loader = [1, 2, 3, 4, 5, 6];

  /***********************
   * LOADING
   ***********************/
  if (loading)
    return (
      <Box
        alignContent={"center"}
        verticalAlign={"middle"}
        padding={"space30"}
        marginBottom="space30"
        height={"100vh"}
      >
        <Flex hAlignContent="center" vertical vAlignContent={"center"}>
          <Flex vAlignContent={"center"}>
            <Card>
              <Stack orientation={"vertical"} spacing={"space40"}>
                <Flex hAlignContent={"center"}>
                  <img src={"intro.png"} width="150px" />
                </Flex>
                <Stack orientation={"horizontal"} spacing={"space100"}>
                  <Paragraph marginBottom="space0">
                    Loading Amazing Demos...
                  </Paragraph>
                </Stack>

                <SkeletonLoader />
                <SkeletonLoader />
              </Stack>
            </Card>
          </Flex>
        </Flex>
      </Box>
    );

  /***********************
   * DEFAULT INDEX
   ***********************/
  return (
    <>
      <Head>
        <title>APJ Demo Showcase</title>

        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preconnect"
          href="https://assets.twilio.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://assets.twilio.com/public_assets/paste-fonts/1.5.2/fonts.css"
        />
      </Head>
      <Header />
      <Box padding={"space50"}>
        <Tabs orientation="vertical" baseId={tabsBaseId} state={tab}>
          <TabList aria-label="Vertical product tabs">
            {tags &&
              tags.map((name, index) => (
                <Tab
                  key={name}
                  onClick={() => {
                    onActivateTab(name);
                  }}
                >
                  {name}
                </Tab>
              ))}
          </TabList>
          {selected && (
            <ListingPage listing={selected} setSelected={onSetSelected} />
          )}
          {!selected && (
            <TabPanels>
              {tags &&
                tags.map((name, index) => (
                  <TabPanel key={name}>
                    <Heading as={"div"} variant={"heading20"}>
                      {name}
                    </Heading>
                    <Listings
                      data={
                        index === 0
                          ? data
                              .sort((a, b) =>
                                a.last_modified > b.last_modified ? -1 : 1
                              )
                              .filter((item) => {
                                const date_now = new Date();
                                const date_updated = new Date(
                                  item.last_modified
                                );

                                let difference =
                                  date_now.getTime() - date_updated.getTime();
                                let days = Math.ceil(
                                  difference / (1000 * 3600 * 24)
                                );

                                return days <= 30 ? true : false;
                              })
                          : index === 1
                          ? data.sort((a, b) => (a.name > b.name ? 1 : -1))
                          : data.filter((item) => item.tags?.includes(name))
                      }
                      setSelected={onSetSelected}
                    />
                  </TabPanel>
                ))}
            </TabPanels>
          )}
        </Tabs>
      </Box>
    </>
  );
};

export default Home;
