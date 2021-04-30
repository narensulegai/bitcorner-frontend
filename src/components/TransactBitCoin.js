import React, { useEffect, useRef, useState } from 'react';
import { setTransactBitcoin, getTransactBitcoin } from '../util/fetch/api';

const TransactBitCoin = () => {
  const [transactBitcoins, setTransactBitcoins] = useState([]);
  const [marketOrder, setIsMarketPrice] = useState(true);
  const isBuyRef = useRef(null);
  const amountRef = useRef(null);
  const currencyRef = useRef(null);
  const minimumPriceRef = useRef(null);

  useEffect(() => {
    (async () => {
      setTransactBitcoins(await getTransactBitcoin());
    })();
  }, []);

  const handleOnSellBitcoin = async () => {
    const amount = amountRef.current.value;
    const currency = currencyRef.current.value;
    let minPrice = null;
    if (!marketOrder) {
      minPrice = minimumPriceRef.current.value;
    }
    const d = {
      buy: isBuyRef.current.checked,
      marketOrder,
      minPrice,
      amount,
      currency,
    };
    await setTransactBitcoin(d);
    window.message('Added new order!');
    setTransactBitcoins(await getTransactBitcoin());
  };

  const handleOnMarketPriceChange = () => {
    setIsMarketPrice(!marketOrder);
  };

  return (
    <div className="flex">

      <div className="flex-full">
        <div>
          <h2>Transact Bitcoin</h2>
        </div>
        <div>
          <div className="small-margin-top">
            Is buy order&nbsp;<input type="checkbox" ref={isBuyRef} />
          </div>
          <div className="small-margin-top">
            Amount <br /><input type="number" ref={amountRef} defaultValue="0" />
          </div>
          <div className="small-margin-top">
            Currency <br /><input type="text" ref={currencyRef} defaultValue="USD" />
          </div>
          <div className="small-margin-top">
            Market price &nbsp;<input type="checkbox" checked={marketOrder}
              onChange={handleOnMarketPriceChange} />
          </div>
          {!marketOrder && (
            <div className="small-margin-top">
              Minimum price <br /><input type="number" ref={minimumPriceRef} defaultValue="0" />
            </div>
          )}
          <div>
            <button className="button" onClick={handleOnSellBitcoin}>Transact bitcoin</button>
          </div>
        </div>
      </div>

      <div className="flex-full">
        <div>{transactBitcoins.length === 0
          ? <div className="center">You have no transactions</div>
          : (
            <table className="table">
              <thead>
                <tr>
                  <td>Order Id</td>
                  <td>Transaction type</td>
                  <td>Currency</td>
                  <td>Amount</td>
                  <td>Price type</td>
                  <td>Minimum price</td>
                </tr>
              </thead>
              <tbody>
                {transactBitcoins.reverse().map((b) => {
                  return (
                    <tr key={b.id}>
                      <td>{b.id}</td>
                      <td>{b.buy ? 'Buy' : 'Sell'}</td>
                      <td>{b.currency}</td>
                      <td>{b.amount}</td>
                      <td>{b.marketOrder ? 'Market order' : 'Limit order'} </td>
                      <td>{b.minPrice}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactBitCoin;
