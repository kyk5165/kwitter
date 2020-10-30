import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { dbService, storageService } from "fbase";
import React, { useState } from "react";

const Kweet = ({ kweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newKweet, setNewKweet] = useState(kweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are you sure you want to delete this kweet?");
    if (ok) {
      await dbService.doc(`kweets/${kweetObj.id}`).delete();
      await storageService.refFromURL(kweetObj.attachmentUrl).delete();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`kweets/${kweetObj.id}`).update({
      text: newKweet,
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewKweet(value);
  };
  return (
    <div className="kweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className="container kweetEdit">
                <input
                  type="text"
                  value={newKweet}
                  required
                  onChange={onChange}
                  autoFocus
                  className="formInput"
                />
                <input type="submit" value="Updata Kweet" className="formBtn" />
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">
                Cancel
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{kweetObj.text}</h4>
          {kweetObj.attachmentUrl && <img src={kweetObj.attachmentUrl} />}
          {isOwner && (
            <div class="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Kweet;
