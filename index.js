/**
 * @typedef Person
 * @type {object}
 * @property {string} name - имя
 * @property {string} birthdate - дата рождения
 */

/**
 * @typedef Gift
 * @type {object}
 * @property {string} title - название подарка
 * @property {number} price - стоимость подарка
 */

/**
 * @param {string} date - дата отсчета
 * @param {Array<Person>} phoneList - список друзей из телефонной книги
 * @returns {Array<Person>} массив друзей, у которых дни рождения после даты отсчета
 */
export function getNextBirthdays(date, phoneList) {
  const splitedDate = date.split(".");
  if (
    !(
      splitedDate.length === 3 &&
      splitedDate[0].length === 2 &&
      splitedDate[1].length === 2 &&
      splitedDate[2].length === 4
    ) ||
    !Array.isArray(phoneList)
  ) {
    console.log("Я сломался");
    return [];
  }

  const nextBirthdays = phoneList
    .filter((person) => filterFutureDays(person.birthdate))
    .filter((person) => {
      const reversedBirthdate = getReversedDate(person.birthdate);
      const reversedDate = getReversedDate(date);

      return reversedDate < reversedBirthdate;
    })
    .sort(sortByBirthdate);

  return nextBirthdays;
}

function filterFutureDays(date) {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yyyy = today.getFullYear();

  const reversedCurrentDate = `${yyyy}.${mm}.${dd}`;
  const reversedDate = getReversedDate(date);

  return reversedDate < reversedCurrentDate;
}

function getReversedDate(date) {
  const dateArray = date.split(".").reverse();
  const reversedDate = `${dateArray[0]}.${dateArray[1]}.${dateArray[2]}`;

  return reversedDate;
}

function sortByBirthdate(first, second) {
  const reversedFirstBirthdate = getReversedDate(first.birthdate);
  const reversedSecondBirthdate = getReversedDate(second.birthdate);
  return reversedFirstBirthdate > reversedSecondBirthdate ? 1 : -1;
}

/**
 * @param {Array<Person>} phoneList - список друзей из телефонной книги
 * @returns {Array<{
 *    month: string,
 *    friends: Array<Person>,
 *  }>}
 */
export function getMonthsList(phoneList) {
  if (!Array.isArray(phoneList)) return [];

  var monthNames = {
    1: "январь",
    2: "февраль",
    3: "март",
    4: "апрель",
    5: "май",
    6: "июнь",
    7: "июль",
    8: "август",
    9: "сентябрь",
    10: "октябрь",
    11: "ноябрь",
    12: "декабрь",
  };

  var monthList = [];

  phoneList
    .filter((person) => filterFutureDays(person.birthdate))
    .forEach((person) => {
      const monthNumber = parseInt(person.birthdate.split(".")[1]);
      const monthName = monthNames[monthNumber];

      if (monthList.some((month) => month.month === monthName))
        monthList
          .find((month) => month.month === monthName)
          .friends.push(person);
      else
        monthList.push({
          month: monthName,
          friends: [person],
        });
    });

  monthList.sort((first, second) =>
    first.friends[0].birthdate.split(".")[1] >
    second.friends[0].birthdate.split(".")[1]
      ? 1
      : -1
  );
  monthList.forEach((month) => month.friends.sort(sortByBirthdate));

  return monthList;
}

/**
 * @param {Array<{
 *    name: string,
 *    birthdate: string,
 *    wishList: Array<Gift>
 *  }>} phoneList - список друзей из телефонной книги
 * @returns {{
 *    friendsList: Array<{
 *      name: string,
 *      birthdate: string,
 *      present: Gift
 *    }>,
 *    totalPrice: number
 *  }}
 */
export function getMinimumPresentsPrice(phoneList) {
  let totalPrice = 0;

  const friendsList = phoneList
    .filter((person) => filterFutureDays(person.birthdate))
    .map((person) => {
      const cheapestWish = person.wishList?.sort(
        (a, b) => a.price - b.price
      )[0];
      const present =
        cheapestWish === undefined
          ? undefined
          : {
              title: cheapestWish.title,
              price: cheapestWish.price,
            };
      totalPrice += cheapestWish === undefined ? 0 : present.price;

      return {
        name: person.name,
        birthdate: person.birthdate,
        present: present,
      };
    });

  return {
    friendsList: friendsList,
    totalPrice: totalPrice,
  };
}

module.exports = { getNextBirthdays, getMonthsList, getMinimumPresentsPrice };
