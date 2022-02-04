import { useEffect, useState } from 'react'

import { HiTag } from 'react-icons/hi'
import { IoMdWallet } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import { AuctionListing, DirectListing, MarketplaceModule, NFTMetadata } from '@3rdweb/sdk'
import { BigNumberish } from 'ethers'

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`
}

const MakeOffer = ({
  isListed,
  selectedNft,
  listings,
  marketPlaceModule
}: {
  isListed?: string
  selectedNft?: NFTMetadata
  listings: (AuctionListing | DirectListing)[]
  marketPlaceModule?: MarketplaceModule
}) => {
  const [selectedMarketNft, setSelectedMarketNft] = useState<AuctionListing | DirectListing>()
  const [enableButton, setEnableButton] = useState(false)

  useEffect(() => {
    if (!listings || isListed === 'false') return
    ;(async () => {
      setSelectedMarketNft(listings.find((marketNft) => marketNft.asset?.id === selectedNft?.id))
    })()
  }, [selectedNft, listings, isListed])

  useEffect(() => {
    if (!selectedMarketNft || !selectedNft) return

    setEnableButton(true)
  }, [selectedMarketNft, selectedNft])

  const confirmPurchase = (toastHandler = toast) =>
    toastHandler.success(`Purchase successful!`, {
      style: {
        background: '#04111d',
        color: '#fff'
      }
    })

  const buyItem = async (
    listingId = selectedMarketNft?.id,
    quantityDesired = 1,
    module = marketPlaceModule
  ) => {
    await module
      ?.buyoutDirectListing({
        listingId: listingId as BigNumberish,
        quantityDesired: quantityDesired
      })
      .catch((error) => console.error(error))

    confirmPurchase()
  }

  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster position="bottom-left" reverseOrder={false} />
      {isListed === 'true' ? (
        <>
          <div
            onClick={() => {
              enableButton ? buyItem(selectedMarketNft?.id, 1) : null
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div>
          <div
            className={`${style.button} border border-[#151c22]  bg-[#363840] hover:bg-[#4c505c]`}
          >
            <HiTag className={style.buttonIcon} />
            <div className={style.buttonText}>Make Offer</div>
          </div>
        </>
      ) : (
        <div className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}>
          <IoMdWallet className={style.buttonIcon} />
          <div className={style.buttonText}>List Item</div>
        </div>
      )}
    </div>
  )
}

export default MakeOffer
