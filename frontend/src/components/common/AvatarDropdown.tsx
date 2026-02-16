import AvatarDropdownMenu from './AvatarDropdownMenu'

const AvatarDropdown = ({ username }: { username: string }) => {
  return (
    <div className='dropdown dropdown-end'>
      <div tabIndex={0} className='btn btn-ghost'>
        <div className='avatar flex items-center gap-2'>
          <div className='w-10 rounded-full bg-amber-600 shadow'>
              <p className="flex items-center h-full text-sm">{username}</p>
          </div>
          <p className='text-md'>{username}</p>
        </div>
      </div>
      <ul tabIndex={0} className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'>
          <AvatarDropdownMenu />
      </ul>
    </div>
  )
}

export default AvatarDropdown