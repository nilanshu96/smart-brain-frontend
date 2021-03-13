import "./Profile.css";

const Profile = ({isProfileOpen, toggleModal}) => {

    return (
        <div className="profile-modal">
            <button onClick={toggleModal}>Click Here</button>
        </div>
    )
}

export default Profile;