
const getData = async (key) => {
  try {
    const result = await $Storage.get(key);
    return result;
  } catch(error) {
    if (error.status === 404 && error.message === 'Record not found') return { events: []};
    console.error('Error in getData', error);
  }
};

const setData = async (key, value) => {
  try {
    await $Storage.set(key, value);
  } catch (error) {
    console.error('Error in setData', error);
  }
}

exports = {
  saveEventMapping: async function (args) {
    return await setData("mapping", args.data);
  },
  onContactUpdate: async function (args) {
    const mappingResponse = await getData("mapping");
    if (mappingResponse?.events) {
      const boardIds = mappingResponse?.board
        ?.map((board) => board?.id)
        .join(", ");
      const columnIds = mappingResponse?.column
        ?.map((col) => `"${col?.id}"`)
        .join(", ");
      const query = `
          query {
            boards(ids: [${boardIds}]) {
              id
              columns { id title }
              items_page {
                items {
                  id
                  column_values(ids: [${columnIds}]) {
                    text
                    id
                    value
                  }
                }
              }
            }
          }
        `;
      const boards = await $Fetch.post(
        "https://api.monday.com/v2",
        JSON.stringify({
          query: query
        }),
        {
          headers: {
            Authorization: "Bearer <%=access_token%>",
            "Content-Type": "application/json"
          },
          isOAuth: true,
          maxAttempts: 5
        }
      );
      const boardValues = boards?.data?.data?.boards;
      boardValues.forEach((board) => {
        const contactStatusColumn = board?.columns?.find(
          (col) => col.title === "Contact Status"
        );
        const itemPageValues = [];
        board.items_page.items.forEach((item) => {
          item.column_values.forEach((value) => itemPageValues.push({ ...value, itemId: item?.id }));
        });
        const contactEmail = args?.data?.attrs?.email;
        const contactPhone = args?.data?.attrs?.phone;
        itemPageValues.forEach(async (page) => {
          const itemId = page?.itemId;
          const pageValue = page?.value;
          if (pageValue) {
           const formattedPage = JSON.parse(pageValue ?? {});
           if (formattedPage["email"] === contactEmail || formattedPage["phone"] === contactPhone) {
            const events = mappingResponse?.events;
            const contactUpdateEvents = args?.data;
            const { bounced, unsubscribed, deactivated } =
              contactUpdateEvents;
            const eventTypes = [
              {
                type: "deactivated",
                condition: events?.deactivated && deactivated,
                message: "DEACTIVATED"
              },
              {
                type: "unsubscribed",
                condition: events?.unsubscribed && unsubscribed,
                message: "UNSUBSCRIBED"
              },
              {
                type: "bounced",
                condition: events?.bounced && bounced,
                message: "BOUNCED"
              },
              {
                type: "subscribed",
                condition: events?.subscribed && !unsubscribed,
                message: "SUBSCRIBED"
              }
            ];

            const event = eventTypes.find((event) => event.condition);
            if (event) {
              const query = `mutation {
                change_simple_column_value (
                  board_id: "${board?.id}",
                  item_id: "${itemId}",
                  column_id: "${contactStatusColumn?.id}",
                  value: "${event.message}"
                ) {
                  id
                }
              }`;
               await $Fetch.post(
                "https://api.monday.com/v2",
                JSON.stringify({
                  query: query
                }),
                {
                  headers: {
                    Authorization: "Bearer <%=access_token%>",
                    "Content-Type": "application/json"
                  },
                  isOAuth: true,
                  maxAttempts: 5
                }
              );
              console.log("********RESPONSE UPDATED*********");
            }
           }

          }
        })
      });
    }
  }
};
