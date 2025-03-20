// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Decentralized Note-Taking App
 * @dev A smart contract that allows users to create, update, delete, and retrieve notes in a decentralized manner.
 */
contract DecentralizedNoteTaking {
    struct Note {
        uint256 id;
        address owner;
        string content;
        uint256 timestamp;
    }

    uint256 private noteCounter;
    mapping(uint256 => Note) private notes;
    mapping(address => uint256[]) private userNotes;

    event NoteCreated(uint256 noteId, address indexed owner, string content, uint256 timestamp);
    event NoteUpdated(uint256 noteId, string newContent, uint256 timestamp);
    event NoteDeleted(uint256 noteId);

    /**
     * @dev Function to create a new note.
     * @param _content The content of the note.
     */
    function createNote(string memory _content) public {
        require(bytes(_content).length > 0, "Note content cannot be empty");

        noteCounter++;
        notes[noteCounter] = Note(noteCounter, msg.sender, _content, block.timestamp);
        userNotes[msg.sender].push(noteCounter);

        emit NoteCreated(noteCounter, msg.sender, _content, block.timestamp);
    }

    /**
     * @dev Function to update an existing note.
     * @param _noteId The ID of the note to be updated.
     * @param _newContent The new content of the note.
     */
    function updateNote(uint256 _noteId, string memory _newContent) public {
        require(bytes(_newContent).length > 0, "New content cannot be empty");
        require(notes[_noteId].owner == msg.sender, "You can only update your own notes");

        notes[_noteId].content = _newContent;
        notes[_noteId].timestamp = block.timestamp;

        emit NoteUpdated(_noteId, _newContent, block.timestamp);
    }

    /**
     * @dev Function to delete a note.
     * @param _noteId The ID of the note to be deleted.
     */
    function deleteNote(uint256 _noteId) public {
        require(notes[_noteId].owner == msg.sender, "You can only delete your own notes");

        delete notes[_noteId];

        emit NoteDeleted(_noteId);
    }

    /**
     * @dev Function to retrieve a note by its ID.
     * @param _noteId The ID of the note.
     * @return id, owner, content, timestamp of the note.
     */
    function getNote(uint256 _noteId) public view returns (uint256, address, string memory, uint256) {
        Note memory note = notes[_noteId];
        require(note.owner != address(0), "Note does not exist");
        return (note.id, note.owner, note.content, note.timestamp);
    }

    /**
     * @dev Function to get all note IDs of the caller.
     * @return Array of note IDs.
     */
    function getMyNotes() public view returns (uint256[] memory) {
        return userNotes[msg.sender];
    }
}
