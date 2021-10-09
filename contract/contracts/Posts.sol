// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Posts {

    uint256 public postsCounter = 0;
    address public owner = msg.sender;
    mapping(uint256 => Post) public posts;

    struct Author {
        address transaction_address;
        string display_name;
    }

    struct Post {
        uint256 id;
        Author author;
        string title;
        string description;
        uint256 created_at;
        bool available;
    }

    event ReceivePost(string eventName, Post post);
    event ReceiveComment(string eventName, uint256 postid, Post post);

    function NewPost(string memory _title, string memory _description, string memory _authorName) public {
        Author memory author = Author(msg.sender, _authorName);

        posts[postsCounter] = Post(postsCounter, author, _title, _description, block.timestamp, true);

        emit ReceivePost("receive_post", posts[postsCounter]);

        postsCounter++;
    }
}
