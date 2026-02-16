const WalletsSkeleton = () => {
  return (
    <div className="container mx-auto py-4 flex flex-col gap-4">
        { Array.from({ length: 16 }).map((_, index) => (
            <div key={index} className="skeleton w-full h-22"></div>
        ))}
    </div>
  )
}

export default WalletsSkeleton