-- CreateTable
CREATE TABLE "Automationsettings" (
    "id" SERIAL NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "dailyauto" INTEGER NOT NULL,
    "cycle" INTEGER NOT NULL,
    "notaskrest" INTEGER NOT NULL,
    "pageaccesstoken" TEXT NOT NULL,
    "pageusername" TEXT NOT NULL,
    "adminid" INTEGER NOT NULL,

    CONSTRAINT "Automationsettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Automationsettings_pageusername_key" ON "Automationsettings"("pageusername");
