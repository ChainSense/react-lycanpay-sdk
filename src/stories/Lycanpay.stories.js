import React from "react";
import { storiesOf } from "@storybook/react";
import Lycanpay from "../../src";
const stories = storiesOf("App Test", module);

stories.add("App", () => {
  return (
    <Lycanpay
      name="LycanPay"
      amount="0.1"
      invoiceno="INV0001"
      currency="USD"
      exp="28-06-2022"
      email="example@gmail.com"
      merchantid="3A6B5593C07C48"
      payconfirmurl="https://www.successurl.com/"
      payfailurl="https://www.failurl.com/"
    />
  );
});
