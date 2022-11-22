import { tokenValidation } from "../middleware/validation";
import {
  postTransactionSell,
  postTransactionExchange,
  tokenAmountUpdate,
  getTransactionList,
} from "../db_Process/transaction.db";
import { login } from "./sign.controller";
import { getMyinfo } from "./user.controller";
import { putGameBag } from "../db_Process/game.db";
import { userInfo } from "../db_Process/user.db";

const list = async (req, res, next) => {
  const transactionList = await getTransactionList();

  if (transactionList) {
    res.status(200).send(transactionList);
  } else {
    res.status(400).send({ message: "거래소 목록을 불러오는데 실패했어요!" });
  }
};

const sell = async (req, res, next) => {
  // const tokenData = tokenValidation(); // 토큰 검정해서 아니라면 에러
  const { item_name, item_count, selling_price, address } = req.body;
  const dbResult = await postTransactionSell(
    item_name,
    item_count,
    selling_price,
    address
  );
  //
  if (dbResult) {
    // && tokenData
    res.status(200).send(dbResult);
  } else {
    res.status(400).send({ message: "아이템 등록에 실패했어요 🥲" });
  }
};

// exchange test 필요함
// exchange 하면 bag 데이터 그대로 뿌려줌
const exchange = async (req, res, next) => {
  // const tokenData = tokenValidation();
  const { address, bag } = req.body;
  const dbResult = await postTransactionExchange(bag, address);
  if (dbResult) {
    // && tokenData
    res.status(200).send(dbResult);
  } else {
    res.status(400).send({ message: "전송을 실패했어요 😭" });
  }
};

// token_amount(햇살): 기존 토큰, updateTokenAmount(햇살): 업데이트된 토큰
// client에게 jwt token, update된 bag 넘겨줘야 함

const buy = async (req, res, next) => {
  const { address, token_amount, item } = req.body;
  // 여기서 token_amount는 업데이트될 토큰양(원래-총소비, 인지는 모르겠음)
  // bag은 업데이트 될 백의 정보

  // 갖고 있던 주소, 가방, 토큰을 준다 -> Post
  // 가방, 토큰 업데이트
  // 업데이트 된 가방 == 기존 가방 ?
  // 업데이트 된 토큰 수량 == 기존 토큰 수량?
  // 둘 다 true면(&&) 구매 성공

  const 기존가방 = await postTransactionExchange(address); // 기존 가방,
  const 기존유저정보 = await userInfo(address); // 기존 유저 정보
  const 소지한토큰 = 기존유저정보.token_amount;

  console.log("🍣", 기존가방); // ㅇㅋ
  console.log("🍱", 소지한토큰); // ㅇㅋ

  // const myInfo = await User.findOne({ where: { user_id: req.body.user_id } });

  const updateTokenAmount = await tokenAmountUpdate(address, token_amount);
  const updateMybag = await putGameBag(address, item);
  console.log("🍒", updateTokenAmount); // 계속 기존 유저 토큰 수량만
  console.log("🥑", updateMybag); // 기존 것만 나옴

  if (true) {
    // && tokenData
    res
      .status(200)
      .send({ message: "구매 성공", data: updateTokenAmount, updateMybag });
  } else {
    res.status(400).send({ message: "구매 실패 😑" });
  }
};

export { list, sell, exchange, buy };
