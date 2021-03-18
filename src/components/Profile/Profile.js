import { useState } from "react";

import "./Profile.css";

const Profile = ({ onRouteChange, toggleModal, user, loadUser }) => {
  const [name, setName] = useState(user.name);
  const [age, setAge] = useState(25);

  const onFormChange = (event) => {
    switch (event.target.name) {
      case "user-name":
        setName(event.target.value);
        break;
      case "user-age":
        setAge(event.target.value);
        break;
      default:
        return;
    }
  };

  const onProfileUpdate = (data, id) => {
    fetch(`${process.env.REACT_APP_API_URL}/profile/${id}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": window.sessionStorage.getItem("token")
      },
      body: JSON.stringify({ formInput: data }),
    })
      .then((resp) => {
        if (resp.status === 200) {
          loadUser({ ...user, ...data });
          toggleModal();
        } else {
          onRouteChange("signOut");
        }
      })
      .catch(console.log);
  };

  return (
    <div className="profile-modal">
      <article className="br3 ba b--black-10 mv4 w-50-m w-25-l mw6 shadow-5 center bg-white w-100">
        <main className="pa4 black-80">
          <div className="measure">
            <img
              src="http://tachyons.io/img/logo.jpg"
              className="h3 w3 dib"
              alt="avatar"
            />
            <h1>{name}</h1>
            <h4>{`Images Submitted: ${user.entries}`}</h4>
            <p>{`Member Since: ${new Date(
              user.joined
            ).toLocaleDateString()}`}</p>
            <hr />

            <label className="b mt2 w6" htmlFor="user-name">
              Name:
            </label>
            <input
              className="pa2 ba w-100"
              type="text"
              name="user-name"
              id="user-name"
              onChange={onFormChange}
              placeholder={name}
            />

            <label className="b mt2 w6" htmlFor="user-age">
              Age:
            </label>
            <input
              className="pa2 ba w-100"
              type="text"
              name="user-age"
              id="user-age"
              onChange={onFormChange}
              placeholder={age}
            />

            <div
              className="mt4"
              style={{ display: "flex", justifyContent: "space-evenly" }}
            >
              <button
                onClick={() => onProfileUpdate({ name }, user.id)}
                className="b pa2 grow pointer hover-white b--black-20 bg-light-blue w-40"
              >
                Save
              </button>
              <button
                className="b pa2 grow pointer hover-white b--black-20 bg-light-red w-40"
                onClick={toggleModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
        <div className="modal-close mr3" onClick={toggleModal}>
          &times;
        </div>
      </article>
    </div>
  );
};

export default Profile;
