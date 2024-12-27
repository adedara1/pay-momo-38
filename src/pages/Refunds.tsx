import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileDown, Filter } from "lucide-react";

export default function Refunds() {
  return (
    <div className="w-full max-w-[100vw] px-2 md:px-4 py-4 md:py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Remboursements</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Exporter en CSV
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                <TableHead>MONTANT REMBOURSÉ</TableHead>
                <TableHead>BÉNÉFICIAIRE</TableHead>
                <TableHead>STATUT</TableHead>
                <TableHead>DATE DE REMBOURSEMENT</TableHead>
                <TableHead>DATE DE CREATION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="h-32">
                <TableCell colSpan={6} className="text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-2">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9" />
                        <path d="M3 12h18" />
                        <path d="m15 16-4-4 4-4" />
                      </svg>
                    </div>
                    <p>Aucun Remboursement trouvé</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-gray-500">
            Affichage de 0 à 0 sur 0 résultats.
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled>«</Button>
            <Button variant="outline" size="sm" disabled>‹</Button>
            <Button variant="default" size="sm">1</Button>
            <Button variant="outline" size="sm" disabled>›</Button>
            <Button variant="outline" size="sm" disabled>»</Button>
          </div>
        </div>
      </div>
    </div>
  );
}