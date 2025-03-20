const getTriggersFromDB = async (props) => {
  try {
    const result = JSON.parse(await props.client.db.getV2("triggers"));
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const saveTriggerConditionToDB = async (props, filters, trigger_id) => {
  try {
    await props.client.db.setV2(`filter_${trigger_id}`, filters);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteTriggerConditionFromDB = async (props, trigger_id) => {
  try {
    await props.client.db.delV2(`filter_${trigger_id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const getTriggerConditionFromDB = async (props, trigger_id) => {
  try {
    const trigger = JSON.parse(
      await props.client.db.getV2(`filter_${trigger_id}`)
    );
    return trigger;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const saveTriggersToDB = async (props, newTrigger, filters) => {
  try {

    newTrigger.created_at = new Date();
    const triggers = await getTriggersFromDB(props);
    await props.client.db.setV2("triggers", [
      newTrigger,
      ...triggers.filter((trigger) => trigger.trigger_id),
    ]);
    if (await saveTriggerConditionToDB(props, filters, newTrigger.trigger_id)) {
      return true;
    } else {
      const triggers = await getTriggersFromDB(props);
      await props.client.db.setV2("triggers", [
        newTrigger,
        ...triggers.filter(
          (trigger) => trigger.trigger_id != newTrigger.trigger_id
        ),
      ]);
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

const deleteTriggersFromDB = async (props, trigger_id) => {
  try {
    const triggers = await getTriggersFromDB(props);
    if (triggers.length === 1) await props.client.db.setV2("triggers", []);
    else
      await props.client.db.setV2("triggers", [
        ...triggers.filter((trigger) => trigger.trigger_id != trigger_id),
      ]);
    if (await deleteTriggerConditionFromDB(props, trigger_id)) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const changeStateOfTriggerInDB = async (props, state, index) => {
  try {
    const triggers = await getTriggersFromDB(props);
    triggers[index].active = state;
    await props.client.db.setV2("triggers", triggers);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const updateTriggersInDB = async (
  props,
  updatedTrigger,
  trigger_id,
  updatedFilters
) => {
  try {
    const triggers = await getTriggersFromDB(props);

    const updatedTriggers = triggers.map((item) => {
      return item.trigger_id === trigger_id
        ? {
            ...item,
            ...updatedTrigger,
            modified_at: new Date(),
          }
        : item;
    });

    await props.client.db.setV2("triggers", updatedTriggers);

    if (await saveTriggerConditionToDB(props, updatedFilters, trigger_id)) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

const getFieldsFromDb = async (props) => {
  try {
    const fields = await props.client.db.getV2("fields");
    return JSON.parse(fields);
  } catch (error) {
    return [];
  }
}

const addFieldsToDb = async (props, item) => {
  const fields = await getFieldsFromDb(props);
  await props.client.db.setV2("fields", [...fields, item]);
}

const removeFieldsFromDb = async (props, id) => {
  try {
    const fields = await getFieldsFromDb(props);
    const updatedFields = fields?.filter((item) => item.id !== id);
    if (updatedFields?.length > 0) await props.client.db.setV2('fields', updatedFields);
    else await props.client.db.delV2('fields');
  } catch (error) {
    console.log(error);
  }
};

export {
  getTriggersFromDB,
  saveTriggersToDB,
  deleteTriggersFromDB,
  getTriggerConditionFromDB,
  updateTriggersInDB,
  changeStateOfTriggerInDB,
  getFieldsFromDb,
  addFieldsToDb,
  removeFieldsFromDb,
};
