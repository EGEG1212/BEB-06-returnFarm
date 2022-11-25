import {
  marketItem_list,
  marketItem_create,
  bag_update,
  tokenAmount_update,
} from "../db_Process/transaction.db";
import { userInfo } from "../db_Process/user.db";

const list = async (req, res, next) => {
  const transactionList = await marketItem_list();

  if (transactionList) {
    res.status(200).send(transactionList);
  } else {
    res.status(400).send({ message: "거래소 목록을 불러오는데 실패했어요!" });
  }
};

const sell = async (req, res, next) => {
  // const tokenData = tokenValidation();
  const { item_name, item_count, selling_price, address } = req.body;
  const dbResult = await marketItem_create(
    item_name,
    item_count,
    selling_price,
    address
  );
  //
  if (dbResult) {
    // && tokenData
    res.status(200).send(dbResult); // true 출력
  } else {
    res.status(400).send({ message: "아이템 등록에 실패했어요 🥲" });
  }
};

const exchange = async (req, res, next) => {
  // const tokenData = tokenValidation();
  const { address, nItem } = req.body;
  const dbResult = await bag_update(address, nItem);
  if (dbResult) {
    // && tokenData
    res.status(200).send(dbResult);
  } else {
    res.status(400).send({ message: "전송을 실패했어요 😭" });
  }
};

const buy = async (req, res, next) => {
  const { user_id, address, ip_amount, item } = req.body;
  const dbUserInfon = await userInfo(user_id, address);
  const haes_sal = dbUserInfon.ip_amount;
  // console.log(haes_sal, "🌞");
  const totalPrice = item[0].price; // 임시로 price
  // console.log(price, "💎");

  if (!haes_sal >= totalPrice) {
    // && tokenData
    res.status(400).send({ message: "구매 실패 😑" });
  } else {
    const updateMyBag = await bag_update(address, item);
    const updateHaesSal = await tokenAmount_update(address, ip_amount);
    res
      .status(200)
      .send({ message: "구매 성공", data: updateHaesSal, updateMyBag });
  }
  return updateMyBag, updateHaesSal;
};

export { list, sell, exchange, buy };
