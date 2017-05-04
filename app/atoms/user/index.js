export async function preInstall() {

}

export async function postInstall() {
    await require('./service/session').syncFromPersist(true);
}