import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from '@material-ui/core';
import { setTransactBitcoin, getTransactBitcoin } from '../util/fetch/api';

const TransactBitCoin = () => {
  const [transactBitcoins, setTransactBitcoins] = useState([]);
  const [marketOrder, setIsMarketPrice] = useState(true);
  const [editOrder, setEditOrder] = useState({});
  const [open, setOpen] = useState(false);
  const isBuyRef = useRef(null);
  const amountRef = useRef(null);
  const currencyRef = useRef(null);
  const minimumPriceRef = useRef(null);
  const editAmountRef = useRef(null);

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
  const toggleModel = () => {
    setOpen(!open);
  };
  const handleOnCancelOrder = async () => {
    const d = {
      id: editOrder.id,
      status: 'CANCELLED',
    };
    await setTransactBitcoin(d);
    toggleModel();
    setTransactBitcoins(await getTransactBitcoin());
  };
  const handleOnEditOrder = async () => {
    const amount = editAmountRef.current.value;
    const d = {
      amount,
      id: editOrder.id,
    };
    await setTransactBitcoin(d);
    toggleModel();
    setTransactBitcoins(await getTransactBitcoin());
  };

  const handleOnEdit = (b) => {
    setEditOrder(b);
    toggleModel();
  };

  return (
    <>
      <Dialog open={open} onClose={toggleModel}>
        <div className="modal">
          <h2>Edit Order</h2>
          <div>
            Amount <br /><input type="number" ref={editAmountRef} defaultValue={editOrder.amount} />
          </div>
          <div className="flex flex-justify-content-space-between">
            <button className="button" onClick={handleOnCancelOrder}>
              Cancel order
            </button>
            <button className="button" onClick={handleOnEditOrder}>
              Update order
            </button>
            <button className="button" onClick={toggleModel}>
              Cancel
            </button>
          </div>
        </div>
      </Dialog>

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
                    <td>Status</td>
                    <td>&nbsp;</td>
                  </tr>
                </thead>
                <tbody>
                  {transactBitcoins.map((b) => {
                    return (
                      <tr key={b.id}>
                        <td>{b.id}</td>
                        <td>{b.buy ? 'Buy' : 'Sell'}</td>
                        <td>{b.currency}</td>
                        <td>{b.amount}</td>
                        <td>{b.marketOrder ? 'Market order' : 'Limit order'} </td>
                        <td>{b.minPrice}</td>
                        <td>{b.status}</td>
                        <td>
                          <button className="button" onClick={() => { handleOnEdit(b); }}>
                            Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TransactBitCoin;