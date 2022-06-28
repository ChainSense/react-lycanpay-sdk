import React, { useEffect } from "react";

const Lycanpay = (props) => {
  console.log(props);
  const args = {
    ...props,
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    protocol: window.location.protocol,
  };

  console.log(args);

  let newWindow;
  let orderid = 0;
  let istestmode = 0;
  let timeDuration = 5000;
  let paymentInterval;

  const initLycanPay = () => {
    const lycanpaybutton = document.getElementById("lycanpaybutton");
    fetch("https://user.lycanpay.com/GetButtonCode", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        merchantid: args.merchantid,
        hostname: args.hostname,
      }),
    })
      .then((response) => response.json())
      .then((datas) => {
        console.log(datas);
        if (datas.status === "Success") {
          lycanpaybutton.innerHTML = "" + datas.data + "";
          lycanpaybutton.addEventListener("click", buttonClick, false);
        } else {
          lycanpaybutton.innerHTML =
            '<span style="font-color:red">Invalid Marchant Id.</span>';
        }
      });
  };

  const buttonClick = () => {
    fetch("https://user.lycanpay.com/SDK_lycanpay", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(args),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "Success") {
          if (data.data.code === "Success") {
            newWindow = window.open(
              data.data.invoiceurl,
              "lycanpay",
              "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,width=720,height=800"
            );
            orderid = data.data.orderno;
            istestmode = data.data.istestmode;
            getPaymentStatus();
          } else {
            alert(data.data.message);
            console.log(data.data.message);
          }
        } else {
          alert(data.message);
          console.log(data.message);
        }
      });
  };

  const getPaymentStatus = () => {
    paymentInterval = setInterval(() => {
      if (orderid > 0) {
        console.log(orderid);

        fetch("https://user.lycanpay.com/Get_SDK_PayStatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderid: orderid,
            istestmode: istestmode,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("JS data", data);
            let payment_data = data.payment_data;
            if (data.status === "Success") {
              if (payment_data.isbuttoninvoice === true) {
                if (payment_data.status_id === 4) {
                  newWindow.close();
                  window.location.href =
                    args.payconfirmurl + "?orderno=" + orderid;
                } else if (payment_data.status_id === 7) {
                  newWindow.close();
                  window.location.href =
                    args.payfailurl + "?orderno=" + orderid;
                } else if (payment_data.status_id === 5) {
                  newWindow.close();
                  window.location.href =
                    args.payfailurl + "?orderno=" + orderid;
                }
              }
            }
            console.log(data);
          });
      }
    }, timeDuration);
  };

  useEffect(() => {
    initLycanPay();
    return () => {
      clearInterval(paymentInterval);
    };
  }, []);

  return <div id="lycanpaybutton"></div>;
};

export default Lycanpay;
