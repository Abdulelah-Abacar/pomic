function ProfileNoPlaylists() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 w-72 p-10 font-medium rounded-2xl bg-stone-900 bg-opacity-30">
      <div className="flex justify-center items-center text-[200px] w-40 h-40 bg-white bg-opacity-10 rounded-[100px] text-white text-opacity-50 aspect-square">
        +
      </div>
      <strong className="text-xl">Create New PlayList</strong>
    </div>
  );
}

export default ProfileNoPlaylists;
