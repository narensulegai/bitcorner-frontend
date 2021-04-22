import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from '@material-ui/core';
import { getSendBill, addSendBill, editSendBill } from '../util/fetch/api';

const SendBill = () => {
  const emailRef = useRef(null);
  const descriptionRef = useRef(null);
  const currencyRef = useRef(null);
  const amountRef = useRef(null);
  const dueRef = useRef(null);
  const editDescriptionRef = useRef(null);
  const editAmountRef = useRef(null);
  const editStatusRef = useRef(null);

  const [sendBills, setSendBills] = useState([]);
  const [editSendBills, setEditSendBills] = useState({});
  const [open, setOpen] = useState(false);
  useEffect(() => {
    (async () => {
      setSendBills(await getSendBill());
    })();
  }, []);

  const handleOnSendBill = async () => {
    const email = emailRef.current.value;
    const description = descriptionRef.current.value;
    const currency = currencyRef.current.value;
    const amount = amountRef.current.value;
    const due = dueRef.current.value;

    const d = {
      email,
      description,
      currency,
      amount,
      due,
    };
    await addSendBill(d);
    setSendBills(await getSendBill());
    emailRef.current.value = '';
    descriptionRef.current.value = '';
    currencyRef.current.value = '';
    amountRef.current.value = '';
    dueRef.current.value = '';
    window.message('Bill added!');
  };

  const handleOnEditSendBill = (b) => {
    setEditSendBills(b);
    setOpen(!open);
  };

  const handleOnSaveEditSendBill = async () => {
    const description = editDescriptionRef.current.value;
    const amount = editAmountRef.current.value;
    const status = editStatusRef.current.value;
    const d = {
      ...editSendBills,
      description,
      amount,
      status,
    };
    await editSendBill(d);
    window.message('Update bill!');
    setOpen(!open);
    setSendBills(await getSendBill());
  };

  const handleClose = () => {
    setOpen(!open);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <div className="modal">
          <h2>Edit bill</h2>
          <div>
            Description <br />
            <input type="text" ref={editDescriptionRef} defaultValue={editSendBills.description} />
          </div>
          <div className="small-margin-top">
            Amount <br />
            <input type="number" ref={editAmountRef} defaultValue={editSendBills.amount} />
          </div>
          <div className="small-margin-top">
            Status <br />
            <input type="text" ref={editStatusRef} defaultValue={editSendBills.status} />
          </div>
          <div className="flex flex-justify-content-space-around">
            <button className="button" onClick={handleOnSaveEditSendBill}>
              Edit bill
            </button>
            <button className="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </div>
      </Dialog>

      <div className="flex">
        <div className="flex-full">
          <h2>Add a bill</h2>
          <div className="small-margin-top">
            Payers email <br /><input type="text" ref={emailRef} />
          </div>
          <div className="small-margin-top">
            Description <br /><input type="text" ref={descriptionRef} />
          </div>
          <div className="small-margin-top">
            Currency <br /><input type="text" ref={currencyRef} />
          </div>
          <div className="small-margin-top">
            Amount <br /><input type="number" ref={amountRef} />
          </div>
          <div className="small-margin-top">
            Due date <br /><input type="date" ref={dueRef} />
          </div>
          <div>
            <button className="button" onClick={handleOnSendBill}>
              Send bill
            </button>
          </div>
        </div>
        <div className="flex-full">
          <h2>Your bills</h2>
          <table className="table">
            <thead>
              <tr>
                <td>Payers Email</td>
                <td>Description</td>
                <td>Currency</td>
                <td>Due date</td>
                <td>Status</td>
                <td>&nbsp;</td>
              </tr>
            </thead>
            <tbody>
              {sendBills.map((b) => {
                return (
                  <tr key={b.id}>
                    <td>{b.email}</td>
                    <td>{b.description}</td>
                    <td>{b.currency}</td>
                    <td>{new Date(b.due).toDateString()}</td>
                    <td>{b.status}</td>
                    <td>
                      <button className="button" onClick={() => { handleOnEditSendBill(b); }}>
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default SendBill;
