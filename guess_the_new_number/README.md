# Capture the Ether / Guess the new number

Implementation:
Create a smart contract that guess the new number on the same block and same transaction where the
guess function is going to be executed.

Challenges:
To call the guess() function a Ether is required to be sent in order for function to pass the require() statement.
So 1 Ether should be sent from the user to the 'wrapper' function that is going to be called, so that the calling smart contract
send 1 Ether to the guess() function. Once the guessing of the new number is complete the called smart contract is going to return 2 Ether
the main the caller smart contract and from that contract to the user. That way why empty the balance of the called smart contract
