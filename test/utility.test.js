const { test } = require('ava');
const { getStreamContent } = require("../lib/utility");
const { getFakeReadableStream } = require('./testUtil')

test("getStreamContent should return original content", async t => {
    const content = "foo";
    t.is(await getStreamContent(getFakeReadableStream(content)), content);
})