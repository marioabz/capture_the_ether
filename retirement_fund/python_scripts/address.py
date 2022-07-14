
# STOLEN FROM STACKOVERFLOW

import rlp
from eth_utils import keccak, to_checksum_address, to_bytes


def mk_contract_address(sender: str, nonce: int) -> str:
    """Create a contract address using eth-utils.

    # https://ethereum.stackexchange.com/a/761/620
    """
    sender_bytes = to_bytes(hexstr=sender)
    raw = rlp.encode([sender_bytes, nonce])
    h = keccak(raw)
    address_bytes = h[12:]
    return to_checksum_address(address_bytes)


ADDRESS = "address"
CONTRACT_GENERATOR = "contract"


for nonce in range(10**5):
    calculated_address = mk_contract_address(CONTRACT_GENERATOR, nonce)
    if calculated_address == ADDRESS:
        print(f"Success!, Nonce is {nonce}")
        break
