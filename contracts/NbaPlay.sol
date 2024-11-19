//SPDX-License-Identifier:MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NbaPlay is ReentrancyGuard {
    using SafeMath for uint256;

    uint256 public _totalGames;
    uint256 public _totalPlayers;

    struct GameStruct {
        uint256 id;
        address owner;
        uint256 participants;
        uint256 stake;
        address winner;
        bool deleted;
        bool paidOut;
    }

    struct PlayerStruct {
        uint256 id;
        uint256 gameId;
        address account;
        uint256 power;
    }

    uint256 public totalBalance;
    uint256 public servicePct;

    mapping(uint256 => bool) public gameExists;
    mapping(uint256 => GameStruct) public games;
    mapping(uint256 => PlayerStruct[]) public players;
    mapping(uint256 => mapping(address => bool)) public isListed;

    constructor(uint256 _taxpct) {}

    function createGame(uint256 _totalPower) public payable {
        require(msg.value > 0 ether, "Stake must be greater than zero");

        _totalGames++;
        GameStruct memory game;
        _totalPlayers = 1;

        game.id = _totalGames;

        game.stake = msg.value;
        game.participants = 1;
        game.owner = msg.sender;

        games[game.id] = game;
        gameExists[game.id] = true;

        PlayerStruct memory newPlayer = PlayerStruct({
            id: _totalPlayers,
            gameId: game.id,
            account: msg.sender,
            power: _totalPower
        });
        players[_totalGames].push(newPlayer);
    }

    function joinGame(uint256 _id, uint256 _totalPower) public payable {
        require(
            msg.value == games[_id].stake,
            "enter the right amount of value"
        );
        require(games[_id].participants <= 2, "cannot enter the game");
        _totalPlayers++;
        games[_id].participants++;
        PlayerStruct memory newPlayer = PlayerStruct({
            id: _totalPlayers,
            gameId: _id,
            account: msg.sender,
            power: _totalPower
        });
        players[_totalGames].push(newPlayer);
    }

    function getWinner(uint256 _id) public {
        require(gameExists[_id], "Game does not exist");
        require(!games[_id].paidOut, "Game already paid out");
        require(
            games[_id].participants == 2,
            "Game needs exactly 2 participants"
        );

        // Get players for this specific game ID
        PlayerStruct[] memory gamePlayers = players[_id];
        require(gamePlayers.length == 2, "Invalid number of players");

        // Determine winner
        if (gamePlayers[1].power > gamePlayers[0].power) {
            games[_id].winner = gamePlayers[1].account;
        } else if (gamePlayers[0].power > gamePlayers[1].power) {
            games[_id].winner = gamePlayers[0].account;
        }
        // Handle tie case
        else {
            games[_id].winner = address(0);
        }

        // Transfer prize
        uint256 totalStakes = games[_id].stake * 2;
        transferAllAmount(games[_id].stake, games[_id].winner, _id);
    }

    // Modified transferAllAmount to handle fees
    function transferAllAmount(
        uint256 stakeAmount,
        address _winner,
        uint256 _id
    ) internal {
        uint256 totalPrize = stakeAmount * 2;
        uint256 platformFee = (totalPrize * servicePct) / 100;
        uint256 winnerPrize = totalPrize - platformFee;

        if (_winner == address(0)) {
            // In case of a tie, split the prize
            uint256 splitPrize = winnerPrize / 2;
            payTo(players[_id][0].account, splitPrize);
            payTo(players[_id][1].account, splitPrize);
        } else {
            payTo(_winner, winnerPrize);
        }

        games[_id].paidOut = true;
    }

    function deleteGame(uint256 gameId) public {
        require(gameExists[gameId], "Game not found");
        require(games[gameId].owner == msg.sender, "Unauthorized entity");

        players[gameId].pop();

        isListed[gameId][msg.sender] = false;
        payTo(msg.sender, games[gameId].stake);

        games[gameId].deleted = true;
    }

    function payout(uint256 gameId) public nonReentrant {
        require(gameExists[gameId], "Game does not exist");
        require(!games[gameId].paidOut, "Game already paid out");

        GameStruct memory game = games[gameId];

        uint256 totalStakes = game.stake.mul(2);
        uint256 platformFee = (totalStakes.mul(servicePct)).div(100);
        uint256 creatorFee = platformFee.div(2);
        // uint256 gameRevenue = totalStakes.sub(platformFee).sub(creatorFee);

        payTo(game.owner, creatorFee);

        games[gameId].paidOut = true;
    }

    function setFeePercent(uint256 _pct) public {
        require(
            _pct > 0 && _pct <= 10,
            "Fee percent must be in the range of (1 - 10)"
        );
        servicePct = _pct;
    }

    function getGames() public view returns (GameStruct[] memory Games) {
        uint256 available;
        for (uint256 i = 1; i <= _totalGames; i++) {
            if (!games[i].deleted && !games[i].paidOut) {
                available++;
            }
        }

        Games = new GameStruct[](available);

        uint256 index;
        for (uint256 i = 1; i <= _totalGames; i++) {
            if (!games[i].deleted && !games[i].paidOut) {
                Games[index++] = games[i];
            }
        }
    }

    function getPaidOutGames() public view returns (GameStruct[] memory Games) {
        uint256 available;
        for (uint256 i = 1; i <= _totalGames; i++) {
            if (!games[i].deleted && games[i].paidOut) {
                available++;
            }
        }

        Games = new GameStruct[](available);

        uint256 index;
        for (uint256 i = 1; i <= _totalGames; i++) {
            if (!games[i].deleted && games[i].paidOut) {
                Games[index++] = games[i];
            }
        }
    }

    function getPlayers(uint256 _id)
        public
        view
        returns (PlayerStruct[] memory)
    {
        return players[_id];
    }

    function getMyGames() public view returns (GameStruct[] memory Games) {
        uint256 available;
        for (uint256 i = 1; i <= _totalGames; i++) {
            if (!games[i].deleted && games[i].owner == msg.sender) {
                available++;
            }
        }

        Games = new GameStruct[](available);

        uint256 index;
        for (uint256 i = 1; i <= _totalGames; i++) {
            if (!games[i].deleted && games[i].owner == msg.sender) {
                Games[index++] = games[i];
            }
        }
    }

    function sendMoney() public payable {}

    function getGame(uint256 gameId) public view returns (GameStruct memory) {
        return games[gameId];
    }

    function currentTime() internal view returns (uint256) {
        return (block.timestamp * 1000) + 1000;
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }
}
