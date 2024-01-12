import { $query, $update, Record, StableBTreeMap, Vec, match, Result, Principal } from 'azle';

type Vote = Record<{
    voter: Principal;
    candidate: string;
}>

const voteStorage = new StableBTreeMap<Principal, Vote>(0, 44, 1024);

$query;
export function getVoteCount(): Result<number, string> {
    return Result.Ok(voteStorage.size());
}

$query;
export function hasVoted(voter: Principal): Result<boolean, string> {
    return Result.Ok(voteStorage.contains(voter));
}

$update;
export function addVote(candidate: string): Result<null, string> {
    const voter = ic.current_caller;
    
    if (voteStorage.contains(voter)) {
        return Result.Err<null, string>('You have already voted.');
    }

    const vote: Vote = { voter, candidate };
    voteStorage.insert(voter, vote);

    return Result.Ok(null);
}
