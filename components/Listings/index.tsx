import React, { useState } from "react";
import { Column, Grid } from "@twilio-paste/core";
import { Box } from "@twilio-paste/core/box";
import { PluginListingCard } from "../PluginListingCard";
import { PluginListing } from "../../serverless/functions/api/data";
export interface ListingProps {
  data: Array<PluginListing>;
  setSelected: any;
}

export const Listings: React.FC<ListingProps> = (props: ListingProps) => {
  return (
    <Box as="main" padding="space30">
      <Grid
        gutter={["space30", "space40", "space30"]}
        vertical={[true, true, false]}
        element="LISTINGGRID"
        equalColumnHeights
      >
        {props.data &&
          props.data.map((item: PluginListing, i: number) => (
            <Column key={i} span={4} element="LISTINGCARD">
              <PluginListingCard
                listing={item}
                setSelected={props.setSelected}
              />
            </Column>
          ))}
      </Grid>
    </Box>
  );
};
