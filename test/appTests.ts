import { assert } from "chai";

const jj = () => "jax";

describe("is organization admin", () => {
    it("should return jax", () => {
        const risultato = jj();
        assert.equal(risultato, "jax");
    });
});
