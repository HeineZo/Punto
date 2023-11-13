import plural from "pluralize-fr";

function pluralize(count, word) {
    return plural(word, count);
}
