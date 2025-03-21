const contractAddress = "0x611a172176930426E5B7D5e8A3c6020462d53989";
const contractABI = [
    [
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "_content",
                    "type": "string"
                }
            ],
            "name": "createNote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_noteId",
                    "type": "uint256"
                }
            ],
            "name": "deleteNote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "noteId",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "content",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "NoteCreated",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "noteId",
                    "type": "uint256"
                }
            ],
            "name": "NoteDeleted",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "noteId",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "newContent",
                    "type": "string"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "NoteUpdated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_noteId",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_newContent",
                    "type": "string"
                }
            ],
            "name": "updateNote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "getMyNotes",
            "outputs": [
                {
                    "internalType": "uint256[]",
                    "name": "",
                    "type": "uint256[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_noteId",
                    "type": "uint256"
                }
            ],
            "name": "getNote",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
];

let web3;
let contract;
let account;

window.addEventListener("load", async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];
        contract = new web3.eth.Contract(contractABI, contractAddress);
        loadNotes();
    } else {
        alert("Please install MetaMask to use this app!");
    }
});

document.getElementById("addNote").addEventListener("click", async () => {
    const noteText = document.getElementById("noteInput").value;
    if (noteText.trim() === "") return alert("Note cannot be empty!");

    await contract.methods.addNote(noteText).send({ from: account });
    document.getElementById("noteInput").value = "";
    loadNotes();
});

async function loadNotes() {
    const notesList = document.getElementById("notes");
    notesList.innerHTML = "";
    const notes = await contract.methods.getNotes().call({ from: account });

    notes.forEach((note, index) => {
        const li = document.createElement("li");
        li.textContent = note;
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.onclick = async () => {
            await contract.methods.deleteNote(index).send({ from: account });
            loadNotes();
        };

        li.appendChild(deleteBtn);
        notesList.appendChild(li);
    });
}
